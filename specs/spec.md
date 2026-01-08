# Phase II – Full-Stack Multi-User Todo Web Application Specification

## Project Overview

A secure, responsive, multi-user web-based Todo application implementing all Basic, Intermediate, and Advanced level features with full persistence in Neon Serverless PostgreSQL. Users authenticate via Better Auth, receive JWT tokens, and manage only their own tasks. All operations strictly enforce user isolation. The application follows a clean monorepo structure with layered specifications and CLAUDE.md guidance.

## Version
2.0.0

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Authentication Requirements](#authentication-requirements)
- [Task Management Features](#task-management-features)
- [API Specification](#api-specification)
- [Database Schema](#database-schema)
- [UI Components](#ui-components)
- [Page Structure](#page-structure)
- [Technical Constraints](#technical-constraints)

## Architecture Overview

The application follows a modern full-stack architecture with:
- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel ORM, Python 3.13+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Deployment**: Frontend on Vercel, Backend on any host with DATABASE_URL

### Repository Structure (Monorepo – Must Match Exactly)
```
full-stack-web-application-todo-app/
├── .specify/                          ← Spec-Kit Plus structure
│   └── memory/
│       └── constitution.md
├── .spec-kit/
│   └── config.yaml
├── history/
│   └── prompts/
├── specs/                             ← All specifications
│   ├── overview.md
│   ├── features/
│   │   ├── authentication.md
│   │   ├── task-basic.md
│   │   ├── task-intermediate.md
│   │   └── task-advanced.md
│   ├── api/
│   │   └── rest-endpoints.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       ├── components.md
│       └── pages.md
├── frontend/                          ← Next.js 16+ App Router
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── CLAUDE.md
├── backend/                           ← FastAPI + SQLModel
│   ├── src/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   ├── db.py
│   │   └── CLAUDE.md
│   ├── tests/
│   └── requirements.txt
├── CLAUDE.md                          ← Root instructions
├── README.md
└── pyproject.toml
```

## Authentication Requirements

### User Stories
1. As a user, I can sign up with email/password
   - Email format validated
   - Password ≥8 chars, hashed with bcrypt
   - Unique email enforced
   - Success → redirect to login

2. As a user, I can log in
   - Valid credentials → JWT issued and stored
   - Redirect to dashboard
   - Invalid → clear error message

### Technical Implementation
- Better Auth handles signup/login on frontend
- On successful login → JWT issued containing "sub" claim with user ID
- Frontend stores token and attaches Authorization: Bearer <token> on every API request
- Backend validates JWT using shared BETTER_AUTH_SECRET and injects user_id into request.state
- All task endpoints use user_id from JWT (NOT from URL path)

### Security Requirements
- Strict user isolation: all queries filter by authenticated user_id
- Unauthorized → 401
- Ownership mismatch → 404 (never reveal resource existence)

## Task Management Features

### Basic Features
1. View my tasks (only mine, sorted newest first, empty state handled)
2. Create task (title required, auto timestamps + user_id)
3. Update task (title/description, updated_at refreshed)
4. Delete task (confirmation modal, only owner)
5. Toggle complete (visual indicator, persisted)

### Intermediate Features
1. Assign priority (high/medium/low) with color coding
2. Add/remove tags (multi-select chips)
3. Search tasks by keyword (title + description)
4. Filter by status, priority, single/multiple tags, due date range
5. Sort by any field (ascending/descending)

### Advanced Features
1. Set due date/time (UTC stored, local display)
2. Mark task recurring with rule (daily/weekly/monthly)
3. Browser requests notification permission
4. Visual overdue warning + optional browser notification for due tasks

## API Specification

### Base URL: /api
All endpoints require JWT authentication via Authorization: Bearer <token> header.

### Available Endpoints:
- GET    /api/tasks                  → List tasks with full query support
- POST   /api/tasks                  → Create task
- GET    /api/tasks/{id}             → Get single task
- PUT    /api/tasks/{id}             → Full update
- PATCH  /api/tasks/{id}             → Partial update
- DELETE /api/tasks/{id}             → Delete task
- PATCH  /api/tasks/{id}/complete    → Toggle completion

### GET /api/tasks Query Parameters
- status: "all" | "pending" | "completed"
- priority: "high" | "medium" | "low"
- tag: string (contains)
- search: string (in title/description)
- sort: "created_at" | "due_date" | "priority" | "title"
- order: "asc" | "desc"
- due_before: ISO datetime
- due_after: ISO datetime

## Database Schema

### User Model
```python
class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(unique=True)
    name: str | None
    created_at: datetime
```

### Task Model
```python
class Task(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Intermediate
    priority: str | None = Field(default=None)  # "high", "medium", "low"
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))

    # Advanced
    due_date: datetime | None = None
    is_recurring: bool = Field(default=False)
    recurrence_rule: str | None = None  # "daily", "weekly", "monthly"
```

### Indexes: user_id, completed, priority, due_date

## UI Components

### Core Components
- TaskList: virtualized list with cards
- TaskItem: title, description, priority badge, tag chips, due date warning, complete checkbox
- TaskFormModal: full form with title, description, priority dropdown, tag input (chips), due date/time picker, recurring toggle + rule selector
- FilterBar: status, priority, tag multi-select, search input, date range, sort dropdown
- Notification request on login; local alerts for near/overdue tasks

## Page Structure

### Frontend Pages (App Router)
- /signup → Signup form
- /login → Login form
- / (protected) → Dashboard: task list, filters, add/edit modals, notifications

## Technical Constraints

### Frontend (Next.js 16+)
- MUST use App Router exclusively (Pages Router forbidden)
- Server Components by default
- Client Components only where interactivity requires ('use client' directive)
- TypeScript in strict mode
- Tailwind CSS exclusively (no inline styles, no CSS modules, no other frameworks)
- Better Auth with JWT plugin enabled
- Type-safe API client in /lib/api.ts that automatically attaches JWT from Better Auth session

### Backend (FastAPI + SQLModel)
- Python 3.13+
- FastAPI as the web framework
- SQLModel as exclusive ORM (no raw SQLAlchemy or SQL strings)
- Pydantic v2 for all request/response validation
- UV as package manager
- Neon Serverless PostgreSQL as database (connection via DATABASE_URL)

### Authentication & Authorization (CRITICAL)
- Better Auth on frontend for signup/login
- JWT tokens issued on login (claim "sub" contains user ID)
- Shared secret via BETTER_AUTH_SECRET environment variable (identical value in frontend and backend)
- Token expiration: 7 days
- Password hashing with bcrypt (handled by Better Auth)
- Backend JWT middleware validates token on every protected request and injects user_id into request.state
- All API routes under /api/ (user_id NOT in path — extracted from JWT)
- Strict ownership enforcement: every database query MUST filter by authenticated user_id
- Unauthorized → 401, ownership mismatch → 404 (never reveal resource existence)

### Security Requirements
- User Data Isolation: ALL task operations must filter by authenticated user_id
- JWT validation on every protected endpoint
- No user can access, modify, or infer existence of another user's data
- SQL injection prevention via SQLModel parameterized queries
- Input validation and sanitization on both frontend and backend

## Success Criteria

- Full Basic + Intermediate + Advanced features implemented
- Secure multi-user authentication with JWT
- Complete user isolation verified
- Data persisted correctly in Neon DB
- Intuitive, polished UI with all filters/sorting/modals
- All code generated by Claude Code with traceability
- Matches exact monorepo structure
- Deployable and functional end-to-end