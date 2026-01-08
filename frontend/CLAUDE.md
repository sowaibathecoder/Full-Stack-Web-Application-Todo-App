# Frontend Development Guidelines

This file contains frontend-specific instructions for the Full-Stack Multi-User Todo Web Application.

## Technology Stack
- Next.js 16+ with App Router
- TypeScript in strict mode
- Tailwind CSS exclusively (no inline styles, no CSS modules)
- Better Auth for authentication with JWT plugin
- React Client Components only where interactivity requires ('use client' directive)
- Server Components by default

## Architecture
- Use App Router exclusively (Pages Router forbidden)
- Server Components by default for data fetching and rendering
- Client Components only where interactivity is required (e.g., forms, modals, real-time updates)
- Type-safe API client in /lib/api.ts that automatically attaches JWT from Better Auth session

## Component Structure
- Place reusable components in frontend/components/
- Use descriptive names for components (e.g., TaskList, TaskItem, TaskFormModal)
- Implement proper TypeScript interfaces for props
- Follow accessibility best practices
- Use Tailwind CSS utility classes for styling

## API Integration
- All API requests must include JWT token automatically
- Implement proper error handling for API calls
- Use loading states during API operations
- Implement optimistic updates where appropriate

## Security Requirements
- Never expose sensitive data in client-side code
- Store JWT tokens securely (preferably using Better Auth's mechanisms)
- Validate all user inputs before sending to backend
- Implement proper authentication checks for protected routes

## File Structure
- App Router pages in frontend/app/
- Reusable components in frontend/components/
- API client in frontend/lib/api.ts
- Utility functions in frontend/utils/
- Hooks in frontend/hooks/
- Type definitions in frontend/types/

## Testing
- Implement component tests using appropriate testing libraries
- Test user interactions and state changes
- Verify API integration works correctly
- Test responsive design on different screen sizes

## Performance
- Optimize component rendering with React.memo where appropriate
- Implement proper data fetching strategies
- Use lazy loading for non-critical components
- Optimize images and assets

## Error Handling
- Implement global error boundaries
- Display user-friendly error messages
- Handle network errors gracefully
- Provide fallback UI states when needed