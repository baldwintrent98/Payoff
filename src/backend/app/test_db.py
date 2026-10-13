
from database import get_connection

connection = None

try:
    connection = get_connection()

    print("Successfully connected to MySQL!")

    cursor = connection.cursor()
    cursor.execute("SELECT DATABASE(), VERSION()")

    result = cursor.fetchone()

    print("Database:", result[0])
    print("MySQL version:", result[1])

    cursor.close()

except Exception as error:
    print("Database connection failed:", error)

finally:
    if connection is not None and connection.is_connected():
        connection.close()
        print("Connection closed.")

