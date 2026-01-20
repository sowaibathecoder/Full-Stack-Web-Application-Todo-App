/**
 * Type-safe API client for the Full-Stack Multi-User Todo Web Application.
 */
import { TaskRead, TaskCreate, TaskUpdate } from '../types/tasks';
import { auth } from './auth';
import { rateLimitCall } from '../utils/rateLimiter';
import { verifyRequestOrigin } from '../utils/security';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Base API request function that handles authentication and common configurations.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Use Better Auth client to get session headers
  // We'll get the token from Better Auth's getSession method instead of localStorage
  let token = null;
  let userId = null;

  try {
    const sessionData = await auth.getSession();
    // Extract the token from the session data
    // Our custom auth stores the token directly in session.token
    token = sessionData?.data?.session?.token;
    userId = sessionData?.data?.user?.id;

    // Additional validation to ensure we have proper authentication
    if (!sessionData?.data?.session || !token) {
      throw new Error('No active session found');
    }
  } catch (error) {
    console.warn('Could not get session from auth system:', error);
    // Don't throw immediately - let the server handle unauthenticated requests
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Only add authorization header if we have a valid token
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // This ensures cookies are sent with requests
    ...options,
  };

  // Verify that the request is going to our API endpoint to prevent SSRF attacks
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  if (!verifyRequestOrigin(fullUrl)) {
    throw new Error('Invalid API endpoint');
  }

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Handle specific error codes
    if (response.status === 401) {
      // Don't redirect here - let the calling component handle unauthorized errors
      throw new Error('Session expired. Please log in again.');
    } else if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    } else if (response.status === 404) {
      throw new Error('Resource not found.');
    } else if (response.status >= 500) {
      // For server errors, don't expose internal details
      throw new Error('Server error. Please try again later.');
    } else {
      // For other errors, try to provide a user-friendly message
      const errorMessage = errorData.detail || errorData.message || `Request failed with status ${response.status}`;
      // Only show the actual error message in development
      if (process.env.NODE_ENV === 'development') {
        throw new Error(errorMessage);
      } else {
        throw new Error('An error occurred while processing your request. Please try again.');
      }
    }
  }

  // For DELETE requests, there's typically no response body
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Task API functions
 */

export interface GetTasksParams {
  skip?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
  order?: string;
  due_before?: string;
  due_after?: string;
}

export const taskApi = {
  /**
   * Get all tasks for the authenticated user
   */
  getTasks: async (params?: GetTasksParams): Promise<TaskRead[]> => {
    return rateLimitCall('api_tasks_get', () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const queryString = queryParams.toString();
      const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

      return apiRequest<TaskRead[]>(endpoint);
    });
  },

  /**
   * Get a specific task by ID
   */
  getTask: async (id: number): Promise<TaskRead> => {
    return rateLimitCall(`api_task_get_${id}`, () => {
      return apiRequest<TaskRead>(`/tasks/${id}`);
    });
  },

  /**
   * Create a new task
   */
  createTask: async (taskData: TaskCreate): Promise<TaskRead> => {
    return rateLimitCall('api_task_create', () => {
      return apiRequest<TaskRead>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
    });
  },

  /**
   * Update an existing task
   */
  updateTask: async (id: number, taskData: TaskUpdate): Promise<TaskRead> => {
    return rateLimitCall(`api_task_update_${id}`, () => {
      return apiRequest<TaskRead>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
    });
  },

  /**
   * Partially update a task
   */
  patchTask: async (id: number, taskData: Partial<TaskUpdate>): Promise<TaskRead> => {
    return rateLimitCall(`api_task_patch_${id}`, () => {
      return apiRequest<TaskRead>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(taskData),
      });
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: number): Promise<void> => {
    return rateLimitCall(`api_task_delete_${id}`, () => {
      return apiRequest<void>(`/tasks/${id}`, {
        method: 'DELETE',
      });
    });
  },

  /**
   * Toggle task completion status
   */
  toggleTaskCompletion: async (id: number): Promise<TaskRead> => {
    return rateLimitCall(`api_task_toggle_${id}`, () => {
      return apiRequest<TaskRead>(`/tasks/${id}/complete`, {
        method: 'PATCH',
      });
    });
  },
};

