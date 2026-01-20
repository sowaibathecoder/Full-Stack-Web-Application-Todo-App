/**
 * Type definitions for Task-related entities in the Todo application.
 */

export interface TaskBase {
  title: string;
  description?: string;
  completed: boolean;
  priority?: string; // "high", "medium", "low"
  tags?: string[];
  due_date?: string; // ISO date string
  is_recurring: boolean;
  recurrence_rule?: string; // "daily", "weekly", "monthly"
}

export interface TaskCreate extends TaskBase {
  title: string;
  user_id?: string; // Will be set by backend from JWT
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  tags?: string[];
  due_date?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
}

export interface TaskRead extends TaskBase {
  id: number;
  user_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}