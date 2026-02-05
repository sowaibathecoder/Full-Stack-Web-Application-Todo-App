"""
Task routes for the Full-Stack Multi-User Todo Web Application.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlalchemy import Text
from ..models import Task
from ..schemas.tasks import TaskRead, TaskCreate, TaskUpdate
from ..dependencies.auth import get_current_user_id
from ..db import get_async_session
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter()


@router.get("/", response_model=List[TaskRead])
async def get_tasks(
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    status: Optional[str] = Query(None, description="Filter by status: 'all', 'completed', 'pending'"),
    priority: Optional[str] = Query(None, description="Filter by priority: 'high', 'medium', 'low'"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    due_before: Optional[str] = Query(None, description="Filter by due date before (ISO format)"),
    due_after: Optional[str] = Query(None, description="Filter by due date after (ISO format)"),
    sort: Optional[str] = Query("created_at", description="Sort by field: 'created_at', 'due_date', 'priority', 'title'"),
    order: Optional[str] = Query("desc", description="Sort order: 'asc' or 'desc'")
):
    """
    Retrieve tasks for the authenticated user with optional filtering and sorting.
    """
    # Base query to get tasks for the current user only
    query = select(Task).where(Task.user_id == current_user_id)

    # Apply filters - safely check for non-empty, non-null values
    if status is not None and isinstance(status, str) and status.strip():
        status_lower = status.lower()
        if status_lower == "completed":
            query = query.where(Task.completed == True)
        elif status_lower == "pending":
            query = query.where(Task.completed == False)
        # If status is "all" or any other value, don't apply status filter

    if priority is not None and isinstance(priority, str) and priority.strip():
        query = query.where(Task.priority == priority.lower())

    # Tag filtering: handle tags stored as JSON string in Text column
    if tag is not None and isinstance(tag, str) and tag.strip():
        # Since tags are stored as JSON string, search for the tag within the JSON string
        # Format might be like ["work", "important"] so we need to match the tag appropriately
        # Use LIKE operator to search for the tag in the JSON string representation
        escaped_tag = tag.replace("'", "''")  # Escape single quotes for SQL safety
        query = query.where(Task.tags.is_not(None)).where(Task.tags.like(f'%{escaped_tag}%'))

    if search is not None and isinstance(search, str) and search.strip():
        from sqlalchemy import or_
        # Search in both title and description - SQLAlchemy handles NULLs properly
        query = query.where(
            or_(
                Task.title.contains(search),
                Task.description.contains(search)
            )
        )

    # Apply due date filters - only if the value is not empty
    if due_before is not None and isinstance(due_before, str) and due_before.strip():
        from datetime import datetime
        try:
            due_before_date = datetime.fromisoformat(due_before.replace('Z', '+00:00'))
            query = query.where(Task.due_date <= due_before_date)
        except ValueError:
            # If the date format is invalid, ignore the filter
            pass
        except AttributeError:
            # If there's an issue with the datetime parsing, ignore the filter
            pass

    if due_after is not None and isinstance(due_after, str) and due_after.strip():
        from datetime import datetime
        try:
            due_after_date = datetime.fromisoformat(due_after.replace('Z', '+00:00'))
            query = query.where(Task.due_date >= due_after_date)
        except ValueError:
            # If the date format is invalid, ignore the filter
            pass
        except AttributeError:
            # If there's an issue with the datetime parsing, ignore the filter
            pass

    # Apply sorting
    valid_sort_fields = ['created_at', 'due_date', 'priority', 'title', 'updated_at', 'completed']
    if sort is not None and isinstance(sort, str) and sort in valid_sort_fields:
        if hasattr(Task, sort):
            sort_field = getattr(Task, sort)
            if order and isinstance(order, str) and order.lower() == "asc":
                query = query.order_by(sort_field.asc())
            else:
                query = query.order_by(sort_field.desc())

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute the query
    result = await session.execute(query)
    tasks = result.scalars().all()

    return tasks


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Create a new task for the authenticated user.
    """
    # Ensure the task is associated with the current user
    db_task = Task(
        **task.dict(exclude={'user_id'}),  # Exclude user_id from the request
        user_id=current_user_id  # Use the authenticated user's ID
    )

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)

    return db_task


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Retrieve a specific task by ID for the authenticated user.
    Returns 404 if the task doesn't exist or doesn't belong to the user.
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    result = await session.execute(query)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Update a specific task by ID for the authenticated user.
    Returns 404 if the task doesn't exist or doesn't belong to the user.
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    result = await session.execute(query)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    # Update the task with the provided fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    await session.commit()
    await session.refresh(db_task)

    return db_task


@router.patch("/{task_id}", response_model=TaskRead)
async def partial_update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Partially update a specific task by ID for the authenticated user.
    Returns 404 if the task doesn't exist or doesn't belong to the user.
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    result = await session.execute(query)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    # Update the task with the provided fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    await session.commit()
    await session.refresh(db_task)

    return db_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Delete a specific task by ID for the authenticated user.
    Returns 404 if the task doesn't exist or doesn't belong to the user.
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    result = await session.execute(query)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    await session.delete(db_task)
    await session.commit()

    return


@router.patch("/{task_id}/complete", response_model=TaskRead)
async def toggle_task_completion(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Toggle the completion status of a specific task for the authenticated user.
    Returns 404 if the task doesn't exist or doesn't belong to the user.
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    result = await session.execute(query)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    # Toggle the completion status
    db_task.completed = not db_task.completed

    await session.commit()
    await session.refresh(db_task)

    return db_task