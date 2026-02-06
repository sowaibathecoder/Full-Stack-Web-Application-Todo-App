"""
Database utility functions for the Full-Stack Multi-User Todo Web Application.
"""
from typing import Optional
from sqlmodel import select
from sqlalchemy.exc import IntegrityError
from ..models import User, Task
from ..db import get_session, get_async_session


async def get_user_by_email(email: str) -> Optional[User]:
    """
    Retrieve a user by their email address.
    """
    async with get_session() as session:
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        return result.scalar_one_or_none()


async def create_user(email: str, password: str, name: Optional[str] = None) -> Optional[User]:
    """
    Create a new user with the provided details.
    """
    from ..auth import get_password_hash

    hashed_password = get_password_hash(password)

    user = User(
        email=email,
        hashed_password=hashed_password,
        name=name
    )

    try:
        async with get_session() as session:
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user
    except IntegrityError:
        # User with this email already exists
        return None


async def get_task_by_id(task_id: int, user_id: str) -> Optional[Task]:
    """
    Retrieve a specific task by its ID for a specific user.
    This ensures user isolation by verifying the task belongs to the user.
    """
    async with get_session() as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()


async def get_tasks_for_user(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
) -> list[Task]:
    """
    Retrieve all tasks for a specific user with optional filters.
    """
    async with get_session() as session:
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters if provided
        if status:
            # Assuming status filter refers to completed field
            if status.lower() == "completed":
                statement = statement.where(Task.completed == True)
            elif status.lower() == "pending":
                statement = statement.where(Task.completed == False)

        if priority:
            statement = statement.where(Task.priority == priority.lower())

        if search:
            from sqlalchemy import or_
            # Search in both title and description - SQLAlchemy handles NULLs properly
            statement = statement.where(
                or_(
                    Task.title.contains(search),
                    Task.description.contains(search)
                )
            )

        # Apply pagination
        statement = statement.offset(skip).limit(limit)

        result = await session.execute(statement)
        return result.scalars().all()


async def create_task_for_user(
    title: str,
    user_id: str,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    tags: Optional[str] = None,
    due_date: Optional[str] = None
) -> Task:
    """
    Create a new task for a specific user.
    """
    from datetime import datetime

    task = Task(
        title=title,
        description=description,
        user_id=user_id,
        priority=priority,
        tags=tags,
        due_date=due_date
    )

    async with get_session() as session:
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task


async def update_task(
    task_id: int,
    user_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    tags: Optional[str] = None,
    due_date: Optional[str] = None
) -> Optional[Task]:
    """
    Update a specific task for a user.
    Only updates fields that are provided.
    """
    from datetime import datetime
    import json

    async with get_session() as session:
        # First verify the task belongs to the user
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            return None

        # Update provided fields
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if completed is not None:
            task.completed = completed
        if priority is not None:
            task.priority = priority
        if tags is not None:
            task.tags = tags
        if due_date is not None:
            task.due_date = due_date

        task.updated_at = datetime.utcnow()

        await session.add(task)
        await session.commit()
        await session.refresh(task)
        return task


async def delete_task(task_id: int, user_id: str) -> bool:
    """
    Delete a specific task for a user.
    Returns True if the task was deleted, False if it didn't exist.
    """
    async with get_session() as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            return False

        await session.delete(task)
        await session.commit()
        return True