# Phase II – Full-Stack Multi-User Todo Web Application Implementation Plan

## Project Overview

**Project**: Phase II – Full-Stack Multi-User Todo Web Application (Hackathon II)
**Version**: 2.0.0
**Objective**: Complete, step-by-step technical implementation plan for building a secure, feature-rich, multi-user Todo web application that fully implements Basic, Intermediate, and Advanced level features. The plan enables Claude Code to generate all code across the monorepo while strictly adhering to the constitution and specification. All architecture decisions prioritize security, user isolation, clean separation, and spec traceability.

## Architecture Overview

### High-Level Architecture (Monorepo)
- **Root**: Shared specs, root CLAUDE.md, configuration
- **/frontend**: Next.js 16+ App Router – handles authentication (Better Auth), protected routes, responsive UI, state management, API client
- **/backend**: FastAPI – handles JWT validation, database sessions, business logic, REST API with strict ownership enforcement
- **Communication**: Frontend → Backend via REST API with JWT in Authorization header
- **Database**: Neon Serverless PostgreSQL (external, connected via DATABASE_URL environment variable)
- **Authentication**: Stateless JWT (Better Auth on frontend, validated on backend with shared BETTER_AUTH_SECRET)

## Implementation Strategy

### 1. Project Foundation
- **Objective**: Establish the monorepo foundation and basic configuration
- **Tasks**:
  - Scaffold monorepo structure exactly as defined in specifications
  - Initialize frontend (Next.js App Router, TypeScript, Tailwind)
  - Initialize backend (FastAPI project layout with src/)
  - Create layered CLAUDE.md files (root, frontend, backend)
  - Set up environment variables (.env.example with DATABASE_URL, BETTER_AUTH_SECRET)
- **Files to create**:
  - `frontend/package.json`
  - `backend/pyproject.toml`
  - `frontend/.env.example`
  - `backend/.env.example`
  - `frontend/CLAUDE.md`
  - `backend/CLAUDE.md`
  - `frontend/tsconfig.json`
  - `backend/src/__init__.py`

### 2. Authentication System
- **Objective**: Implement secure authentication with Better Auth and JWT
- **Tasks**:
  - Configure Better Auth in frontend with JWT plugin enabled
  - Implement signup/login pages with validation and error handling
  - Create auth context/provider for token management and protected routes
  - Implement backend JWT dependency: validate token, extract user_id from "sub" claim, store in request.state
- **Files to create**:
  - `frontend/app/signup/page.tsx`
  - `frontend/app/login/page.tsx`
  - `frontend/lib/auth.ts`
  - `frontend/components/AuthProvider.tsx`
  - `backend/src/auth.py`
  - `backend/src/middleware/jwt.py`

### 3. Database Layer
- **Objective**: Implement SQLModel-based database layer with proper relationships and indexing
- **Tasks**:
  - Define SQLModel models ORM (User managed by Better Auth, extended Task with all fields)
  - Implement database connection and session dependency
  - Create database utilities (get_db, automatic timestamps)
  - Ensure indexes for performance (user_id, completed, priority, due_date)
- **Files to create**:
  - `backend/src/models.py`
  - `backend/src/db.py`
  - `backend/src/database/utils.py`

### 4. Backend API Layer
- **Objective**: Build comprehensive REST API with strict ownership enforcement
- **Tasks**:
  - Implement base router under /api
  - Create task routes with dependency on authenticated user_id
  - Implement full CRUD with ownership checks
  - Build advanced GET /api/tasks with comprehensive query parameters (filtering, searching, sorting)
  - Implement toggle complete endpoint
  - Add proper error handling (401 unauthorized, 404 not found for ownership mismatch)
- **Files to create**:
  - `backend/src/main.py`
  - `backend/src/routes/__init__.py`
  - `backend/src/routes/tasks.py`
  - `backend/src/schemas/__init__.py`
  - `backend/src/schemas/tasks.py`
  - `backend/src/dependencies/__init__.py`
  - `backend/src/dependencies/auth.py`

### 5. Frontend Core
- **Objective**: Implement core frontend infrastructure with API integration
- **Tasks**:
  - Implement protected layout and route guarding
  - Create type-safe API client (/lib/api.ts) that automatically attaches JWT
  - Build dashboard page with task list, loading states, error handling
  - Implement TaskList and TaskItem components with visual indicators (priority colors, tag chips, due warnings)
- **Files to create**:
  - `frontend/app/layout.tsx`
  - `frontend/app/page.tsx`
  - `frontend/lib/api.ts`
  - `frontend/components/ProtectedRoute.tsx`
  - `frontend/components/TaskList.tsx`
  - `frontend/components/TaskItem.tsx`

### 6. Task Management UI – Basic
- **Objective**: Implement basic task management functionality
- **Tasks**:
  - Implement TaskFormModal for create/update (title, description)
  - Add delete confirmation and toggle complete functionality
  - Ensure real-time updates after CRUD operations
- **Files to create**:
  - `frontend/components/TaskFormModal.tsx`
  - `frontend/components/DeleteConfirmation.tsx`

### 7. Intermediate Features
- **Objective**: Add intermediate features like priority, tags, filtering, and sorting
- **Tasks**:
  - Extend TaskFormModal with priority dropdown and tag multi-select/chips
  - Implement FilterBar with status, priority, tag, search, and sort controls
  - Add date range filtering for due dates
  - Ensure API calls include all query parameters
- **Files to create**:
  - `frontend/components/FilterBar.tsx`
  - `frontend/components/SortControls.tsx`
  - `frontend/components/PrioritySelector.tsx`
  - `frontend/components/TagInput.tsx`

### 8. Advanced Features
- **Objective**: Implement advanced features including due dates, recurring tasks, and notifications
- **Tasks**:
  - Add date/time picker for due_date in TaskFormModal
  - Implement recurring task toggle with rule selector (daily/weekly/monthly)
  - Request browser notification permission on login
  - Implement local notification scheduling for due/overdue tasks
  - Add visual overdue indicators
- **Files to create**:
  - `frontend/components/DatePicker.tsx`
  - `frontend/components/RecurringTaskSelector.tsx`
  - `frontend/hooks/useNotifications.ts`
  - `frontend/utils/notification.ts`

### 9. Polish & Non-Functional
- **Objective**: Complete the application with professional polish
- **Tasks**:
  - Add loading skeletons and success/error toasts
  - Ensure full responsive design (mobile-friendly)
  - Implement logout functionality
  - Add empty states and helpful messages
- **Files to create**:
  - `frontend/components/LoadingSpinner.tsx`
  - `frontend/components/EmptyState.tsx`
  - `frontend/components/NotificationToast.tsx`
  - `frontend/components/UserProfileDropdown.tsx`

## Recommended Implementation Order (Sequential Tasks)

### Phase 1: Foundation (Tasks 1-3)
1. **Monorepo scaffolding and initial configuration** (Task 1)
   - Files: package.json, pyproject.toml, tsconfig.json, CLAUDE.md files
2. **Better Auth setup in frontend with JWT plugin** (Task 2)
   - Files: auth provider, signup/login pages
3. **Database models and connection setup** (Task 3)
   - Files: models.py, db.py

### Phase 2: Core API & Frontend Infrastructure (Tasks 4-5)
4. **Basic task CRUD API endpoints (with ownership enforcement)** (Task 4)
   - Files: main.py, routes/, schemas/, dependencies/
5. **Frontend authentication pages and protected routes** (Task 5)
   - Files: layout.tsx, pages, api client

### Phase 3: Basic UI & Functionality (Tasks 6)
6. **Type-safe API client with JWT attachment** (Task 5 continued)
7. **Basic dashboard with task list and CRUD modals** (Task 6)
   - Files: TaskList, TaskItem, TaskFormModal

### Phase 4: Enhanced Features (Tasks 7-8)
8. **Enhanced GET /tasks with full filtering/sorting/search** (Task 4 continued)
9. **Intermediate UI controls (priority, tags, filters, sort)** (Task 7)
   - Files: FilterBar, SortControls, PrioritySelector, TagInput
10. **Advanced form fields (due date picker, recurring)** (Task 8)
    - Files: DatePicker, RecurringTaskSelector

### Phase 5: Advanced Features & Polish (Tasks 8-9)
11. **Browser notification integration** (Task 8 continued)
    - Files: notification hooks/utils
12. **Final polish: loading states, toasts, responsive design, error handling** (Task 9)
    - Files: LoadingSpinner, EmptyState, NotificationToast, UserProfileDropdown

### Phase 6: Documentation & Deployment
13. **Documentation updates (README with run instructions)**
    - Files: README.md, documentation

## Security & Quality Gates

### Backend Security Requirements
- Every backend route must depend on authenticated user_id
- All database queries must filter by user_id
- Ownership mismatch returns 404 (never reveal resource existence)
- JWT validation failure returns 401
- Full error handling on both sides

### Frontend Security Requirements
- JWT tokens stored securely (preferably in httpOnly cookies if possible, or in memory)
- No sensitive data exposed in client-side code
- Proper input validation before sending to backend
- CSRF protection if needed

### Implementation Constraints
- No user_id in API paths — extracted from JWT only
- All code generated by Claude Code from atomic tasks
- Full traceability with task references in code comments
- Exact match to specified repository structure

## Technology Decisions & Rationale

### Why Next.js App Router
- Modern, server-first approach
- Built-in optimization features
- Excellent TypeScript support
- Perfect for the requirements

### Why FastAPI
- Fast development with automatic docs
- Excellent Pydantic integration
- Built-in async support
- Strong typing capabilities

### Why SQLModel
- Combines SQLAlchemy with Pydantic
- Perfect for FastAPI integration
- Type safety across backend
- Clean, declarative model definitions

### Why Better Auth
- Production-ready authentication
- Good JWT support
- Easy integration with Next.js
- Handles password hashing automatically

## Risk Analysis & Mitigation

### Top 3 Risks
1. **Data Isolation Failures** - Risk of users accessing other users' data
   - Mitigation: Extensive testing of user_id filtering, code reviews, automated tests
2. **JWT Security Issues** - Risk of token hijacking or improper validation
   - Mitigation: Proper secret management, token expiration, secure transport
3. **Performance Degradation** - Risk of slow queries with large datasets
   - Mitigation: Proper indexing, pagination, query optimization

## Evaluation & Validation

### Definition of Done
- [ ] All basic, intermediate, and advanced features implemented
- [ ] All API endpoints functional with proper authentication
- [ ] User isolation verified and tested
- [ ] Responsive UI working on mobile and desktop
- [ ] Error handling implemented throughout
- [ ] All code traced back to specification requirements

### Testing Strategy
- Unit tests for backend API endpoints
- Integration tests for authentication flow
- Component tests for frontend components
- End-to-end tests for critical user journeys

## Success Alignment

This plan delivers a complete, secure, full-featured Todo web application covering all Basic, Intermediate, and Advanced requirements, with strict spec-driven implementation, perfect user isolation, and readiness for deployment and future phases. The implementation follows the constitution's principles of spec-driven development, AI as primary developer, and mandatory traceability.