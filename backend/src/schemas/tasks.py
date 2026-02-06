"""
Task schemas for the Full-Stack Multi-User Todo Web Application.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class TaskBase(BaseModel):
    """
    Base schema for task with common fields.
    """
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[str] = None
    tags: Optional[List[str]] = []
    due_date: Optional[datetime] = None
    is_recurring: bool = False
    recurrence_rule: Optional[str] = None


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    The user_id will be set by the backend from the JWT token.
    """
    title: str


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence_rule: Optional[str] = None


class TaskRead(TaskBase):
    """
    Schema for reading a task with additional fields.
    """
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True