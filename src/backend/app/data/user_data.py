
from app.database import get_connection


def get_user_by_email(email: str):
    connection = get_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT user_id, first_name, last_name, email, password_hash
            FROM `user`
            WHERE email = %s
            LIMIT 1
            """,
            (email,),
        )

        return cursor.fetchone()

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()


def create_user(
    first_name: str,
    last_name: str,
    email: str,
    password_hash: str,
) -> int:
    connection = get_connection()
    cursor = None

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO `user`
                (first_name, last_name, email, password_hash)
            VALUES (%s, %s, %s, %s)
            """,
            (first_name, last_name, email, password_hash),
        )

        user_id = cursor.lastrowid
        connection.commit()

        return user_id

    except Exception:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()
