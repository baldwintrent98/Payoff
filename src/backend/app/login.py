from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from argon2 import PasswordHasher
from argon2.exceptions import HashingError
import mysql.connector

from app.database import get_connection

connection = None
cursor = None

try:
    connection = get_connection()
    dbh = connection.cursor()
except mysql.connector.Error as err:
    if connection is not None and connection.is_connected():
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="A database error occurred while trying to connect in main.py"
        )

app = FastAPI(title="Payoff API")

# Allow requests from your local React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

password_hasher = PasswordHasher()

class grabUser(BaseModel):
    first_name: str = Field(min_length=1, max_length=45)
    last_name: str = Field(min_length=1, max_length=45)
    email: str = Field(min_length=1, max_length=55)
    password: str = Field(min_length=8, max_length=128)

class LoginRequest(BaseModel):
    email: str = Field(min_length=1, max_length=55)
    password: str = Field(min_length=1, max_length=128)


@app.post("/login")
def login(credentials: LoginRequest):
    connection = None
    cursor = None

    try:
        connection = get_connection()

        # Use a dictionary cursor so we can access columns by name.
        cursor = connection.cursor(dictionary=True)

        # Find the account using the submitted email.
        cursor.execute(
            """
            SELECT id, first_name, last_name, email, password_hash
            FROM user
            WHERE email = %s
            LIMIT 1
            """,
            (credentials.email.strip(),),
        )

        user = cursor.fetchone()

        # Do not reveal whether an email exists.
        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password.",
            )

        # Verify the submitted password against the stored hash.
        try:
            password_hasher.verify(
                user["password_hash"],
                credentials.password,
            )
        except (
            VerifyMismatchError,
            VerificationError,
            InvalidHashError,
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password.",
            )

        # Return only information safe for the frontend to receive.
        return {
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"],
            },
        }

    except HTTPException:
        raise

    except mysql.connector.Error:
        raise HTTPException(
            status_code=500,
            detail="A database error occurred.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()
