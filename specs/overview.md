# Phase II – Full-Stack Multi-User Todo Web Application Specification

## Project Overview

A secure, responsive, multi-user web-based Todo application implementing all Basic, Intermediate, and Advanced level features with full persistence in Neon Serverless PostgreSQL. Users authenticate via Better Auth, receive JWT tokens, and manage only their own tasks. All operations strictly enforce user isolation. The application follows a clean monorepo structure with layered specifications and CLAUDE.md guidance.

## Version
2.0.0

## Architecture Overview

The application follows a modern full-stack architecture with:
- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel ORM, Python 3.13+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Deployment**: Frontend on Vercel, Backend on any host with DATABASE_URL

## Core Features

### Authentication
- User signup and login via Better Auth
- JWT token-based authentication
- Secure session management
- User isolation enforcement

### Task Management (Basic)
- Create, read, update, delete (CRUD) operations
- Task completion toggling
- Personalized task management per user

### Task Management (Intermediate)
- Priority assignment (high, medium, low)
- Tagging system with multi-select
- Search functionality
- Advanced filtering and sorting

### Task Management (Advanced)
- Due date/time scheduling
- Recurring tasks with rule support
- Browser notifications for upcoming tasks
- Enhanced UX with warnings and alerts

## Technical Constraints

- Strict user data isolation: All operations must filter by authenticated user_id
- JWT validation on every protected endpoint
- No cross-user data access allowed
- Responsive design for mobile and desktop
- Type-safe API communication