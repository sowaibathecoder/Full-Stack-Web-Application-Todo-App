"""
Database models for the Full-Stack Multi-User Todo Web Application.
"""
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, DateTime, Boolean, Text
from enum import Enum
import uuid
import json


class TaskPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"


class User(SQLModel, table=True):
    """
    User model representing application users.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, max_length=36)
    email: str = Field(unique=True, nullable=False, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)  # argon2 hash length
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """
    Task model representing user tasks with all required fields.
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)  # Index for user_id

    title: str = Field(nullable=False, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False, sa_column=Column(Boolean, index=True))  # Index for completed

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Intermediate features
    priority: Optional[str] = Field(sa_column=Column(String, index=True))  # Index for priority
    tags: Optional[str] = Field(default='[]', sa_column=Column(Text))  # Store as JSON string, default to empty array

    # Advanced features
    due_date: Optional[datetime] = Field(
        sa_column=Column(DateTime, index=True)  # Index for due_date
    )
    is_recurring: bool = Field(default=False)
    recurrence_rule: Optional[str] = Field(default=None, max_length=20)  # daily, weekly, monthly

    # Relationship to user
    user: User = Relationship(back_populates="tasks")


# Update the User model with the forward reference
User.model_rebuild()