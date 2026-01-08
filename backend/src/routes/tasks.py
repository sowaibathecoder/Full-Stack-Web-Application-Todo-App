"""
Task routes for the Full-Stack Multi-User Todo Web Application.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
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
    status: Optional[str] = Query(None, description="Filter by status: 'completed', 'pending'"),
    priority: Optional[str] = Query(None, description="Filter by priority: 'high', 'medium', 'low'"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    sort: Optional[str] = Query("created_at", description="Sort by field: 'created_at', 'due_date', 'priority', 'title'"),
    order: Optional[str] = Query("desc", description="Sort order: 'asc' or 'desc'")
):
    """
    Retrieve tasks for the authenticated user with optional filtering and sorting.
    """
    # Base query to get tasks for the current user only
    query = select(Task).where(Task.user_id == current_user_id)

    # Apply filters
    if status:
        if status.lower() == "completed":
            query = query.where(Task.completed == True)
        elif status.lower() == "pending":
            query = query.where(Task.completed == False)

    if priority:
        query = query.where(Task.priority == priority.lower())

    if search:
        from sqlalchemy import or_
        query = query.where(
            or_(
                Task.title.contains(search),
                Task.description.contains(search) if Task.description else False
            )
        )

    # Apply sorting
    if hasattr(Task, sort):
        sort_field = getattr(Task, sort)
        if order.lower() == "asc":
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