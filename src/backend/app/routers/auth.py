
from fastapi import APIRouter, HTTPException
from mysql.connector import Error as MySQLError

from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import (
    register_user,
    authenticate_user,
)

router = APIRouter()


@router.post("/register", status_code=201)
def register(request: RegisterRequest):
    try:
        return register_user(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            password=request.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        ) from exc
    except MySQLError as exc:
        print(f"Registration database error: {exc!r}")
        raise HTTPException(
            status_code=500,
            detail="A database error occurred during registration.",
        ) from exc


@router.post("/login")
def login(credentials: LoginRequest):
    try:
        user = authenticate_user(
            email=credentials.email,
            password=credentials.password,
        )
    except MySQLError as exc:
        raise HTTPException(
            status_code=500,
            detail="A database error occurred during login.",
        ) from exc

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    return {
        "message": "Login successful!",
        "user": user,
    }
