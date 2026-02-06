"""
Database connection utilities for the Full-Stack Multi-User Todo Web Application.
"""
from typing import AsyncGenerator, Generator
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool
from .config import settings
from .models import User, Task  # Import models to register them with SQLModel metadata for table creation

# Function to clean SSL parameters for different database drivers
def get_clean_database_url(original_url: str) -> str:
    """Remove SSL parameters that might cause issues with certain drivers."""
    if '?' in original_url and ('?sslmode=' in original_url or '&sslmode=' in original_url or '&channel_binding=' in original_url):
        if '?' in original_url:
            main_url, params_str = original_url.split('?', 1)
            params = params_str.split('&')
            filtered_params = []
            # Parameters that are known to cause issues with database drivers
            problematic_params = ('sslmode=', 'sslcert=', 'sslkey=', 'sslrootcert=', 'channel_binding=')
            for param in params:
                if not any(param.startswith(p) for p in problematic_params):
                    filtered_params.append(param)
            if filtered_params:
                return f"{main_url}?{'&'.join(filtered_params)}"
            else:
                return main_url
    return original_url

# Synchronous engine for sync operations
clean_db_url = get_clean_database_url(settings.database_url)
sync_engine = create_engine(
    clean_db_url,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Asynchronous engine for async operations
def get_async_database_url():
    """Convert sync database URL to async format."""
    db_url = settings.database_url
    # Replace postgresql:// with postgresql+asyncpg:// for async operations
    if db_url.startswith("postgresql://"):
        # Remove SSL parameters that asyncpg may not support
        base_url = db_url.replace("postgresql://", "postgresql+asyncpg://")
        # Remove sslmode, channel_binding, and other SSL parameters if present
        if '?' in base_url:
            main_url, params_str = base_url.split('?', 1)
            params = params_str.split('&')
            filtered_params = []
            # Parameters that are known to cause issues with asyncpg
            problematic_params = ('sslmode=', 'sslcert=', 'sslkey=', 'sslrootcert=', 'channel_binding=')
            for param in params:
                if not any(param.startswith(p) for p in problematic_params):
                    filtered_params.append(param)
            if filtered_params:
                base_url = f"{main_url}?{'&'.join(filtered_params)}"
            else:
                base_url = main_url
        return base_url
    elif db_url.startswith("postgres://"):
        # Same treatment for postgres:// URLs
        base_url = db_url.replace("postgres://", "postgresql+asyncpg://")
        if '?' in base_url:
            main_url, params_str = base_url.split('?', 1)
            params = params_str.split('&')
            filtered_params = []
            # Parameters that are known to cause issues with asyncpg
            problematic_params = ('sslmode=', 'sslcert=', 'sslkey=', 'sslrootcert=', 'channel_binding=')
            for param in params:
                if not any(param.startswith(p) for p in problematic_params):
                    filtered_params.append(param)
            if filtered_params:
                base_url = f"{main_url}?{'&'.join(filtered_params)}"
            else:
                base_url = main_url
        return base_url
    else:
        return db_url

async_engine = create_async_engine(
    get_async_database_url(),
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)


def create_db_and_tables():
    """
    Create database tables synchronously.
    This function creates all tables defined in the models.
    """
    try:
        SQLModel.metadata.create_all(sync_engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise


async def create_db_and_tables_async():
    """
    Create database tables asynchronously.
    This function creates all tables defined in the models.
    """
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        print("Database tables created successfully (async)")
    except Exception as e:
        print(f"Error creating database tables (async): {e}")
        raise


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get an asynchronous database session.
    This is a dependency function for FastAPI to provide database sessions.
    """
    async with AsyncSession(async_engine) as session:
        yield session


def get_session() -> Generator[Session, None, None]:
    """
    Get a synchronous database session.
    This is a dependency function for FastAPI to provide database sessions.
    """
    with Session(sync_engine) as session:
        yield session