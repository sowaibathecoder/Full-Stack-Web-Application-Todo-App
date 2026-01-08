"""
Database connection utilities for the Full-Stack Multi-User Todo Web Application.
"""
from typing import AsyncGenerator, Generator
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool
from .config import settings
from .models import User, Task  # Import all models to register them

# Synchronous engine for sync operations
sync_engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Asynchronous engine for async operations
async_engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
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
    SQLModel.metadata.create_all(sync_engine)


async def create_db_and_tables_async():
    """
    Create database tables asynchronously.
    This function creates all tables defined in the models.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


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