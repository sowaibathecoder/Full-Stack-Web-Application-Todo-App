"""
Pytest configuration for backend tests.
"""
import pytest
from sqlmodel import SQLModel, create_engine
from backend.src.db import engine
from backend.src.main import app
from httpx import AsyncClient
from sqlalchemy.pool import StaticPool


@pytest.fixture(scope="session")
def test_engine():
    """Create a test database engine."""
    # Use an in-memory SQLite database for tests
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(scope="function")
def test_db_session(test_engine):
    """Create a test database session."""
    from sqlmodel import Session

    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)

    yield session

    session.close()
    connection.close()


@pytest.fixture
async def client():
    """Create a test client for the FastAPI app."""
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac