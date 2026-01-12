/**
 * Type-safe API client for the Full-Stack Multi-User Todo Web Application.
 */
import { TaskRead, TaskCreate, TaskUpdate } from '../types/tasks';
import { auth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Base API request function that handles authentication and common configurations.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get the session using Better Auth client
  const session = typeof window !== 'undefined' ? await auth.getSession() : null;
  const token = session?.session?.token || null;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Handle specific error codes
    if (response.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
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
  getTasks: (params?: GetTasksParams): Promise<TaskRead[]> => {
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
  },

  /**
   * Get a specific task by ID
   */
  getTask: (id: number): Promise<TaskRead> => {
    return apiRequest<TaskRead>(`/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: (taskData: TaskCreate): Promise<TaskRead> => {
    return apiRequest<TaskRead>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update an existing task
   */
  updateTask: (id: number, taskData: TaskUpdate): Promise<TaskRead> => {
    return apiRequest<TaskRead>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Partially update a task
   */
  patchTask: (id: number, taskData: Partial<TaskUpdate>): Promise<TaskRead> => {
    return apiRequest<TaskRead>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: (id: number): Promise<void> => {
    return apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle task completion status
   */
  toggleTaskCompletion: (id: number): Promise<TaskRead> => {
    return apiRequest<TaskRead>(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  },
};

