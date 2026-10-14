
from argon2 import PasswordHasher
from argon2.exceptions import (
    InvalidHashError,
    VerificationError,
    VerifyMismatchError,
)
from mysql.connector import IntegrityError

from app.data import user_data


password_hasher = PasswordHasher()


def register_user(
    first_name: str,
    last_name: str,
    email: str,
    password: str,
) -> dict:
    existing_user = user_data.get_user_by_email(email)

    if existing_user is not None:
        raise ValueError("An account with this email already exists. file: auth_service.py")

    # Never save a plaintext password.
    password_hash = password_hasher.hash(password)

    try:
        user_id = user_data.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=password_hash,
        )
    except IntegrityError as exc:
        # Protect against simultaneous duplicate registrations.
        if exc.errno == 1062:
            raise ValueError(
                "An account with this email already exists. file: auth_service.py"
            ) from exc
        raise

    return {
        "message": "Account created successfully!",
        "user": {
            "user_id": user_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
        },
    }


def authenticate_user(email: str, password: str) -> dict | None:
    user = user_data.get_user_by_email(email)

    if user is None:
        return None

    try:
        password_hasher.verify(user["password_hash"], password)
    except (
        VerifyMismatchError,
        VerificationError,
        InvalidHashError,
    ):
        return None

    return {
        "user_id": user["user_id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
    }
