# UI Components Specification

## Overview

This document defines the reusable UI components for the Full-Stack Multi-User Todo Web Application. All components are designed to work with Next.js 16+ App Router and Tailwind CSS, following modern React best practices and accessibility standards.

## Component Categories

### Task Components

#### TaskItem
**Purpose**: Display individual task with all relevant information and actions
**Props**:
- `task`: Task object containing all task properties
- `onCompleteToggle`: Function called when completion status changes
- `onEdit`: Function called when edit action is triggered
- `onDelete`: Function called when delete action is triggered
- `className`: Additional CSS classes for customization

**Features**:
- Displays title with strikethrough when completed
- Shows priority badge with color coding (high: red, medium: yellow, low: green)
- Displays tag chips with close buttons for removal
- Shows due date with visual warning for overdue tasks
- Completion checkbox with accessible labeling
- Edit and delete buttons with proper ARIA labels
- Responsive layout for different screen sizes

#### TaskList
**Purpose**: Display a list of tasks with virtualization for performance
**Props**:
- `tasks`: Array of task objects
- `onCompleteToggle`: Function called when task completion changes
- `onEdit`: Function called when task edit is triggered
- `onDelete`: Function called when task delete is triggered
- `loading`: Boolean indicating if data is loading
- `emptyState`: Component to show when no tasks exist
- `className`: Additional CSS classes for customization

**Features**:
- Virtualized scrolling for large task lists
- Empty state handling
- Loading skeleton states
- Keyboard navigation support
- Drag-and-drop support (future consideration)
- Infinite scroll or pagination support

#### TaskFormModal
**Purpose**: Modal form for creating and editing tasks
**Props**:
- `open`: Boolean controlling modal visibility
- `onOpenChange`: Function to control modal visibility
- `initialData`: Initial task data for editing (optional)
- `onSubmit`: Function called when form is submitted
- `onCancel`: Function called when modal is cancelled

**Features**:
- Title input with validation
- Description textarea
- Priority selection dropdown with visual indicators
- Tag input with multi-select and auto-suggest
- Due date/time picker with calendar interface
- Recurring task toggle with rule selector
- Form validation and error display
- Loading states during submission
- Keyboard accessibility (Escape to close, Enter to submit)

### Filter and Sort Components

#### FilterBar
**Purpose**: Provides filtering controls for task lists
**Props**:
- `filters`: Current filter state
- `onFilterChange`: Function called when filters change
- `showSearch`: Boolean to show/hide search input
- `showPriorityFilter`: Boolean to show/hide priority filter
- `showTagFilter`: Boolean to show/hide tag filter
- `showStatusFilter`: Boolean to show/hide status filter

**Features**:
- Search input with real-time filtering
- Status filter (all, pending, completed)
- Priority filter multi-select
- Tag filter with multi-select
- Due date range picker
- Clear all filters button
- Collapsible sections for mobile

#### SortControls
**Purpose**: Controls for sorting tasks
**Props**:
- `sortBy`: Current sort field
- `sortOrder`: Current sort order ('asc' or 'desc')
- `onSortChange`: Function called when sort changes
- `availableFields`: Array of available sort fields

**Features**:
- Sort field selection dropdown
- Ascending/descending toggle
- Visual indicators for current sort
- Default sort field configuration

### Navigation and Layout Components

#### AuthenticatedLayout
**Purpose**: Main layout wrapper for authenticated routes
**Props**:
- `children`: Child components to render
- `user`: User object for display

**Features**:
- Navigation sidebar with links
- User profile dropdown
- Responsive mobile menu
- Main content area with proper spacing
- Global loading indicators

#### PageHeader
**Purpose**: Standard header for application pages
**Props**:
- `title`: Page title
- `subtitle`: Optional subtitle
- `actions`: Array of action buttons to display
- `breadcrumbs`: Array of breadcrumb items (optional)

**Features**:
- Responsive title display
- Action buttons with proper sizing
- Breadcrumb navigation
- Mobile-friendly layout

### Utility Components

#### NotificationToast
**Purpose**: Display system notifications and alerts
**Props**:
- `type`: Notification type ('success', 'error', 'warning', 'info')
- `message`: Message to display
- `duration`: Auto-dismiss duration in milliseconds
- `onDismiss`: Function called when toast is dismissed

**Features**:
- Auto-dismiss with configurable duration
- Manual dismiss option
- Visual distinction by type
- Positioning options
- ARIA live region for accessibility

#### LoadingSpinner
**Purpose**: Indicate loading states
**Props**:
- `size`: Size of spinner ('sm', 'md', 'lg')
- `label`: Accessible label for spinner
- `className`: Additional CSS classes

**Features**:
- Accessible loading indicators
- Multiple size options
- Customizable appearance
- ARIA attributes for screen readers

#### EmptyState
**Purpose**: Display when no data is available
**Props**:
- `icon`: Icon to display
- `title`: Main title
- `description`: Descriptive text
- `actionText`: Text for primary action button
- `onActionClick`: Function called when action button clicked

**Features**:
- Visual illustration of empty state
- Clear messaging
- Call-to-action button
- Responsive design

### Form Components

#### InputField
**Purpose**: Standard input field with validation
**Props**:
- `id`: Field identifier
- `label`: Field label
- `type`: Input type
- `value`: Current value
- `onChange`: Change handler
- `error`: Error message to display
- `required`: Whether field is required
- `placeholder`: Placeholder text

**Features**:
- Label association
- Error state display
- Required field indicators
- Accessibility attributes
- Flexible styling

#### SelectField
**Purpose**: Dropdown selection component
**Props**:
- `id`: Field identifier
- `label`: Field label
- `value`: Current value
- `onChange`: Change handler
- `options`: Array of options {value, label}
- `error`: Error message to display
- `required`: Whether field is required
- `placeholder`: Placeholder text

**Features**:
- Accessible dropdown
- Error state display
- Required field indicators
- Custom option rendering
- Keyboard navigation

#### TagInput
**Purpose**: Input for creating and managing tags
**Props**:
- `value`: Current tags array
- `onChange`: Change handler
- `placeholder`: Placeholder text
- `suggestions`: Array of suggested tags
- `maxTags`: Maximum number of tags allowed

**Features**:
- Tag chip display with removal
- Input for new tags
- Auto-suggest from existing tags
- Duplicate prevention
- Keyboard navigation support

#### DatePicker
**Purpose**: Date and time selection component
**Props**:
- `value`: Current date value
- `onChange`: Change handler
- `minDate`: Minimum selectable date
- `maxDate`: Maximum selectable date
- `showTimeSelect`: Whether to show time picker
- `placeholder`: Placeholder text

**Features**:
- Calendar interface
- Time selection capability
- Date range validation
- Localization support
- Keyboard navigation

## Styling Guidelines

### Tailwind CSS Usage
- Use utility-first approach with Tailwind classes
- Leverage responsive prefixes for mobile-first design
- Use consistent color palette defined in theme
- Apply consistent spacing with Tailwind scale
- Use focus-visible for accessible focus states

### Responsive Design
- Mobile-first approach with progressive enhancement
- Use appropriate breakpoints (sm, md, lg, xl)
- Ensure touch targets are appropriately sized
- Optimize layouts for different viewport sizes

### Accessibility
- All interactive elements must be keyboard accessible
- Proper ARIA attributes for complex components
- Sufficient color contrast ratios
- Semantic HTML structure
- Focus management for modals and dynamic content

## State Management

### Component State
- Use React hooks (useState, useEffect, etc.) for local state
- Implement proper cleanup for effects
- Use useCallback for stable function references
- Consider React.memo for performance optimization

### Context Usage
- Use React Context for shared state across component tree
- Implement proper TypeScript interfaces for context values
- Separate context providers by domain (auth, tasks, etc.)

## Performance Considerations

### Virtual Scrolling
- Implement virtual scrolling for large lists
- Use libraries like react-window for efficient rendering
- Optimize rendering performance with React.memo

### Code Splitting
- Lazy load components that aren't immediately needed
- Use React.lazy and Suspense for route-level splitting
- Consider component-level splitting for heavy components

### Image Optimization
- Use Next.js Image component for optimization
- Implement proper alt text for accessibility
- Consider lazy loading for off-screen images

## Testing Guidelines

### Component Testing
- Write unit tests for component logic
- Include accessibility tests
- Test responsive behavior
- Verify proper prop handling
- Test user interaction flows