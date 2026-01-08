# REST API Endpoints Specification

## Overview

This document defines all REST API endpoints for the Full-Stack Multi-User Todo Web Application. All endpoints are protected and require JWT authentication. The user ID is extracted from the JWT token, not from the URL path.

## Base URL
`/api`

## Authentication

All endpoints under `/api` require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The backend validates the JWT using the shared BETTER_AUTH_SECRET and injects the user_id into request.state. All operations filter by this user_id to ensure data isolation.

## Common Headers

### Request Headers
- `Authorization: Bearer <token>` - Required for all endpoints
- `Content-Type: application/json` - For POST/PUT/PATCH requests

### Response Headers
- `Content-Type: application/json` - For JSON responses
- `Cache-Control: no-cache` - For authenticated endpoints

## Common Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found or does not belong to authenticated user"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error or malformed request",
  "details": {
    "field": "error_description"
  }
}
```

## Task Endpoints

### List Tasks
- **Endpoint**: `GET /api/tasks`
- **Description**: Retrieve the authenticated user's tasks with optional filtering and sorting
- **Query Parameters**:
  - `status`: "all" | "pending" | "completed" (default: "all")
  - `priority`: "high" | "medium" | "low"
  - `tag`: string (filter by tag containing this value)
  - `search`: string (search in title and description)
  - `sort`: "created_at" | "due_date" | "priority" | "title" (default: "created_at")
  - `order`: "asc" | "desc" (default: "desc")
  - `due_before`: ISO datetime (filter tasks due before this date)
  - `due_after`: ISO datetime (filter tasks due after this date)
  - `limit`: number (pagination limit, default: 50)
  - `offset`: number (pagination offset, default: 0)

- **Response (200)**:
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "user-uuid",
      "title": "Sample Task",
      "description": "Sample description",
      "completed": false,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "priority": "medium",
      "tags": ["work", "important"],
      "due_date": "2023-01-15T10:00:00Z",
      "is_recurring": false,
      "recurrence_rule": null
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Create Task
- **Endpoint**: `POST /api/tasks`
- **Description**: Create a new task for the authenticated user
- **Request Body**:
```json
{
  "title": "Task title",
  "description": "Task description",
  "priority": "high", // optional: "high", "medium", "low"
  "tags": ["tag1", "tag2"], // optional
  "due_date": "2023-01-15T10:00:00Z", // optional
  "is_recurring": false, // optional
  "recurrence_rule": "weekly" // optional: "daily", "weekly", "monthly"
}
```

- **Response (201)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "priority": "high",
  "tags": ["tag1", "tag2"],
  "due_date": "2023-01-15T10:00:00Z",
  "is_recurring": false,
  "recurrence_rule": "weekly"
}
```

### Get Single Task
- **Endpoint**: `GET /api/tasks/{id}`
- **Description**: Retrieve a specific task by ID
- **Path Parameter**: `id` (task ID)
- **Response (200)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "priority": "high",
  "tags": ["tag1", "tag2"],
  "due_date": "2023-01-15T10:00:00Z",
  "is_recurring": false,
  "recurrence_rule": "weekly"
}
```

### Update Task (Full)
- **Endpoint**: `PUT /api/tasks/{id}`
- **Description**: Fully update a task (replaces entire task object)
- **Path Parameter**: `id` (task ID)
- **Request Body**: Same as Create Task
- **Response (200)**: Same as Create Task

### Update Task (Partial)
- **Endpoint**: `PATCH /api/tasks/{id}`
- **Description**: Partially update a task
- **Path Parameter**: `id` (task ID)
- **Request Body** (any combination of these fields):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "tags": ["new-tag"],
  "due_date": "2023-01-15T10:00:00Z",
  "is_recurring": true,
  "recurrence_rule": "daily"
}
```

- **Response (200)**: Updated task object

### Delete Task
- **Endpoint**: `DELETE /api/tasks/{id}`
- **Description**: Delete a task
- **Path Parameter**: `id` (task ID)
- **Response (204)**: No content

### Toggle Task Completion
- **Endpoint**: `PATCH /api/tasks/{id}/complete`
- **Description**: Toggle the completion status of a task
- **Path Parameter**: `id` (task ID)
- **Request Body**:
```json
{
  "completed": true // optional, if omitted, toggles current status
}
```

- **Response (200)**:
```json
{
  "id": 1,
  "completed": true,
  "updated_at": "2023-01-01T00:00:00Z"
}
```

## User Endpoints

### Get Current User
- **Endpoint**: `GET /api/user`
- **Description**: Get information about the currently authenticated user
- **Response (200)**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2023-01-01T00:00:00Z"
}
```

## Response Format Conventions

### Success Responses
- 200: Successful GET, PUT, PATCH operations
- 201: Successful POST operation
- 204: Successful DELETE operation (no content)

### Error Responses
- 400: Bad request, validation errors
- 401: Unauthorized, invalid token
- 403: Forbidden (not used - 404 is preferred for ownership issues)
- 404: Resource not found or doesn't belong to user
- 500: Internal server error

## Security Considerations
- All endpoints validate JWT and user ownership
- 404 responses for unauthorized access (don't reveal resource existence)
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- Rate limiting recommendations (implementation-dependent)

## Performance Considerations
- Proper indexing on filtered/searched fields
- Pagination for list endpoints
- Efficient query patterns
- Caching strategies (as needed)