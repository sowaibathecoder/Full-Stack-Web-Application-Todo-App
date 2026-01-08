# Backend Development Guidelines

This file contains backend-specific instructions for the Full-Stack Multi-User Todo Web Application.

## Technology Stack
- Python 3.13+
- FastAPI as the web framework
- SQLModel as exclusive ORM (no raw SQLAlchemy or SQL strings)
- Pydantic v2 for all request/response validation
- Neon Serverless PostgreSQL as database (connection via DATABASE_URL)

## Architecture
- All API routes under /api/ (user_id NOT in path — extracted from JWT)
- Strict ownership enforcement: every database query MUST filter by authenticated user_id
- JWT validation on every protected endpoint
- Stateless JWT authentication with shared BETTER_AUTH_SECRET
- Backend JWT middleware validates token on every protected request and injects user_id into request.state

## Database Layer
- Use SQLModel exclusively for ORM operations
- All models must inherit from SQLModel and use table=True
- Use Field() for primary keys, foreign keys, and constraints
- Implement proper indexing for frequently queried fields
- All database queries must filter by user_id from authentication

## API Design
- Follow RESTful principles for API endpoints
- Use Pydantic models for request/response validation
- Implement proper error handling (401, 404, 422)
- Return appropriate HTTP status codes
- Use dependency injection for authentication and database sessions

## Security Requirements
- User Data Isolation: ALL task operations must filter by authenticated user_id
- Unauthorized → 401, ownership mismatch → 404 (never reveal resource existence)
- No user can access, modify, or infer existence of another user's data
- SQL injection prevention via SQLModel parameterized queries
- Input validation and sanitization on all endpoints
- Proper JWT validation with shared secret

## File Structure
- Main application entry point in backend/src/main.py
- Database models in backend/src/models.py
- Database utilities in backend/src/db.py
- API routes in backend/src/routes/
- Request/response schemas in backend/src/schemas/
- Dependencies (auth, database) in backend/src/dependencies/
- Middleware in backend/src/middleware/
- Utilities in backend/src/utils/

## Authentication & Authorization
- Better Auth on frontend for signup/login
- JWT tokens issued on login (claim "sub" contains user ID)
- Shared secret via BETTER_AUTH_SECRET environment variable
- Token expiration: 7 days
- Backend JWT middleware validates token on every protected request
- Inject user_id into request.state for use in route handlers

## Error Handling
- Implement custom exception handlers
- Return consistent error response format
- Log errors appropriately
- Never expose internal system details to clients
- Handle database connection errors gracefully

## Performance
- Implement proper database indexing
- Use pagination for large datasets
- Optimize database queries with proper filtering
- Implement caching where appropriate
- Monitor query performance

## Testing
- Implement unit tests for all API endpoints
- Test authentication and authorization logic
- Verify user isolation requirements
- Test error scenarios and edge cases
- Use pytest and pytest-asyncio for testing