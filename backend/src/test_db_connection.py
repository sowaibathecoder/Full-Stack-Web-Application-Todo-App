"""
Test script to verify database connection and model creation.
"""
import asyncio
from .db import create_db_and_tables_async


async def test_db_connection():
    """
    Test function to create database tables and verify connection.
    """
    try:
        await create_db_and_tables_async()
        print("Database tables created successfully!")
        return True
    except Exception as e:
        print(f"Error creating database tables: {e}")
        return False


if __name__ == "__main__":
    asyncio.run(test_db_connection())