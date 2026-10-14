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


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=45)
    first_name: str = Field(min_length=1, max_length=45)
    last_name: str = Field(min_length=1, max_length=45)
    password: str = Field(min_length=8, max_length=128)

@app.post("/registerUser", status_code=201)
def register_user(user: UserCreate):
    username = user.username.strip()
    first_name = user.first_name.strip()
    last_name = user.last_name.strip()

    if not username or not first_name or not last_name:
        raise HTTPException(
            status_code=422,
            detail="Username and names cannot be blank."
        )

    try:
        # Hash the password before storing it.
        hashed_password = password_hasher.hash(user.password)

        # Check whether the username already exists.
        dbh.execute(
            "SELECT user_id FROM user WHERE username = %s",
            (username,)
        )

        if dbh.fetchone() is not None:
            raise HTTPException(
                status_code=409,
                detail="That username is already taken."
            )

        # Insert the new user into the existing table.
        dbh.execute(
            """
            INSERT INTO user
                (username, first_name, last_name, password_hash)
            VALUES (%s, %s, %s, %s)
            """,
            (username, first_name, last_name, hashed_password)
        )

        new_user_id = dbh.lastrowid
        connection.commit()

        return {
            "message": "Account created successfully!",
            "user_id": new_user_id,
            "username": username,
        }

    except HTTPException:
        raise

    except mysql.connector.Error as e:
        if connection is not None and connection.is_connected():
            connection.rollback()
            print(e)
        raise HTTPException(
            status_code=500,
            detail="A database error occurred while creating the account."
        )

    except HashingError:
        raise HTTPException(
            status_code=500,
            detail="Could not securely process the password."
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()