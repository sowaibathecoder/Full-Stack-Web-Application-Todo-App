# Database Schema Specification

## Overview

This document defines the SQLModel database schema for the Full-Stack Multi-User Todo Web Application. The schema enforces data integrity, user isolation, and supports all required features including basic, intermediate, and advanced task management capabilities.

## Technology Stack

- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Python Version**: 3.13+

## Database Models

### User Model

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    name: str | None = Field(default=None)


class User(UserBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Additional fields for authentication would go here
    # (hashed_password, etc.) depending on Better Auth implementation
```

**Table Name**: `user`

**Fields**:
- `id`: Primary key, string UUID, auto-generated
- `email`: String, unique, not nullable, for authentication
- `name`: String, nullable, user's display name
- `created_at`: Datetime, automatically set to current UTC time

**Constraints**:
- Primary key: `id`
- Unique constraint: `email`

**Indexes**:
- Primary key index on `id`
- Unique index on `email`

### Task Model

```python
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime
from datetime import datetime
from typing import List
import json

class TaskBase(SQLModel):
    title: str = Field(max_length=200, nullable=False)
    description: str | None = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)

    # Intermediate features
    priority: str | None = Field(default=None)  # "high", "medium", "low"
    tags: List[str] = Field(default_factory=list)

    # Advanced features
    due_date: datetime | None = None
    is_recurring: bool = Field(default=False)
    recurrence_rule: str | None = Field(default=None)  # "daily", "weekly", "monthly"


class Task(TaskBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )

    # Relationship to user (optional, for ORM convenience)
    user: "User" = Relationship(back_populates="tasks")


class User(UserBase, table=True):
    # ... (previous fields)

    # Relationship to tasks (optional, for ORM convenience)
    tasks: List["Task"] = Relationship(back_populates="user")
```

**Table Name**: `task`

**Fields**:
- `id`: Primary key, integer, auto-incrementing
- `user_id`: String, foreign key to `user.id`, indexed for performance
- `title`: String, max length 200, not nullable, the task title
- `description`: String, max length 2000, nullable, task details
- `completed`: Boolean, default false, completion status
- `created_at`: Datetime, automatically set to current UTC time
- `updated_at`: Datetime, automatically updated when record is modified
- `priority`: String, nullable, values: "high", "medium", "low"
- `tags`: JSON array of strings, default empty array, for task categorization
- `due_date`: Datetime, nullable, deadline for the task
- `is_recurring`: Boolean, default false, indicates if task repeats
- `recurrence_rule`: String, nullable, values: "daily", "weekly", "monthly"

**Constraints**:
- Primary key: `id`
- Foreign key: `user_id` references `user.id`
- Check constraint: `priority` IN ('high', 'medium', 'low') (implementation-dependent)
- Check constraint: `recurrence_rule` IN ('daily', 'weekly', 'monthly') (implementation-dependent)

**Indexes**:
- Primary key index on `id`
- Index on `user_id` for efficient user-based queries
- Index on `completed` for filtering
- Index on `priority` for filtering
- Index on `due_date` for date-based queries
- GIN index on `tags` for efficient tag-based queries (PostgreSQL-specific)

## Database Design Principles

### User Isolation
- All tasks are linked to a specific user via the `user_id` foreign key
- All queries must filter by `user_id` to ensure data isolation
- No direct access to other users' tasks is possible through foreign key constraints

### Data Integrity
- Foreign key constraints ensure referential integrity
- NOT NULL constraints on required fields
- Length constraints on string fields to prevent oversized data
- Proper indexing for performance

### Extensibility
- JSON field for tags allows flexible categorization
- Nullable fields for optional advanced features
- Timestamps for audit trail and temporal queries

## Migration Strategy

### Initial Schema Creation
1. Create `user` table first (since `task` references it)
2. Create `task` table with all fields
3. Create all indexes
4. Apply any check constraints

### Future Migrations
- Use Alembic (via SQLModel's SQLAlchemy base) for schema evolution
- Maintain backward compatibility where possible
- Plan rollback procedures for each migration
- Test migrations on copy of production data

## Performance Considerations

### Indexing Strategy
- Primary keys are automatically indexed
- Foreign keys (`user_id`) are indexed for join performance
- Frequently queried fields (`completed`, `priority`, `due_date`) are indexed
- JSON fields (`tags`) use GIN index for efficient searching

### Query Optimization
- All queries should use the `user_id` filter first for partitioning
- Use LIMIT and OFFSET for pagination of large result sets
- Consider materialized views for complex aggregations (future enhancement)

## Security Considerations

### Access Control
- Database user should have minimal required privileges
- Connection string stored in environment variables
- Prepared statements used for all queries (handled by SQLModel)

### Data Protection
- Sensitive data (passwords) stored separately from application data
- Encryption at rest (handled by Neon PostgreSQL)
- Network encryption (TLS) for all connections

## Backup and Recovery

### Regular Backups
- Automated backups via Neon PostgreSQL
- Point-in-time recovery capability
- Regular backup verification procedures

### Disaster Recovery
- Backup restoration procedures documented
- Cross-region backup options considered
- Recovery time objectives defined