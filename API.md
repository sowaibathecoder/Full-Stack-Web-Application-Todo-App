# API Documentation

This document provides detailed information about the API endpoints available in the Full-Stack Multi-User Todo Web Application.

## Base URL

All API endpoints are prefixed with `/api`. The base URL depends on your deployment:
- Development: `http://localhost:8000/api`
- Production: `https://yourdomain.com/api`

## Authentication

All endpoints except authentication endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/logout
Logout the current user.

**Response:**
```json
{}
```

### Tasks

#### GET /tasks
Get all tasks for the authenticated user with optional filtering and sorting.

**Query Parameters:**
- `skip` (integer): Number of records to skip (for pagination)
- `limit` (integer): Maximum number of records to return (for pagination)
- `status` (string): Filter by status ('all', 'pending', 'completed')
- `priority` (string): Filter by priority ('low', 'medium', 'high')
- `search` (string): Search in title and description
- `sort` (string): Field to sort by ('created_at', 'due_date', 'priority', 'title')
- `order` (string): Sort order ('asc', 'desc')
- `due_before` (string): Filter tasks with due date before this date (ISO format)
- `due_after` (string): Filter tasks with due date after this date (ISO format)

**Response:**
```json
[
  {
    "id": "task_id",
    "user_id": "user_id",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "medium",
    "tags": ["tag1", "tag2"],
    "due_date": "2023-12-31T10:00:00",
    "is_recurring": false,
    "recurrence_rule": null,
    "created_at": "2023-01-01T10:00:00",
    "updated_at": "2023-01-01T10:00:00"
  }
]
```

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "tags": ["work", "important"],
  "due_date": "2023-12-31T10:00:00",
  "is_recurring": false,
  "recurrence_rule": null
}
```

**Response:**
```json
{
  "id": "new_task_id",
  "user_id": "user_id",
  "title": "New task",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "tags": ["work", "important"],
  "due_date": "2023-12-31T10:00:00",
  "is_recurring": false,
  "recurrence_rule": null,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-01T10:00:00"
}
```

#### GET /tasks/{id}
Get a specific task by ID.

**Path Parameters:**
- `id` (integer): Task ID

**Response:**
```json
{
  "id": "task_id",
  "user_id": "user_id",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "tags": ["tag1", "tag2"],
  "due_date": "2023-12-31T10:00:00",
  "is_recurring": false,
  "recurrence_rule": null,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-01T10:00:00"
}
```

#### PUT /tasks/{id}
Update a task completely.

**Path Parameters:**
- `id` (integer): Task ID

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "tags": ["updated", "tag"],
  "due_date": "2023-12-31T15:00:00",
  "is_recurring": true,
  "recurrence_rule": "weekly"
}
```

**Response:**
```json
{
  "id": "task_id",
  "user_id": "user_id",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "tags": ["updated", "tag"],
  "due_date": "2023-12-31T15:00:00",
  "is_recurring": true,
  "recurrence_rule": "weekly",
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-02T10:00:00"
}
```

#### PATCH /tasks/{id}
Partially update a task.

**Path Parameters:**
- `id` (integer): Task ID

**Request Body (any of these fields):**
```json
{
  "title": "Partially updated title",
  "completed": true,
  "priority": "low"
}
```

**Response:**
```json
{
  "id": "task_id",
  "user_id": "user_id",
  "title": "Partially updated title",
  "description": "Original description",
  "completed": true,
  "priority": "low",
  "tags": ["original", "tags"],
  "due_date": "2023-12-31T10:00:00",
  "is_recurring": false,
  "recurrence_rule": null,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-02T10:00:00"
}
```

#### DELETE /tasks/{id}
Delete a task.

**Path Parameters:**
- `id` (integer): Task ID

**Response:**
```json
{}
```

#### PATCH /tasks/{id}/complete
Toggle the completion status of a task.

**Path Parameters:**
- `id` (integer): Task ID

**Response:**
```json
{
  "id": "task_id",
  "user_id": "user_id",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "priority": "medium",
  "tags": ["tag1", "tag2"],
  "due_date": "2023-12-31T10:00:00",
  "is_recurring": false,
  "recurrence_rule": null,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-02T10:00:00"
}
```

## Error Codes

- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User trying to access resources they don't own
- `404 Not Found`: Requested resource doesn't exist
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server-side errors

## Rate Limiting

All endpoints are subject to rate limiting to prevent abuse:
- 1000 requests per hour per IP address
- 100 requests per hour per authenticated user

## CORS Policy

The API allows requests from:
- `http://localhost:3000` (development)
- Your production domain