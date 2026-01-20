/**
 * Utility functions for sanitizing user input to prevent XSS and other injection attacks.
 */

// DOMPurify-like function for sanitizing HTML (simplified for client-side use)
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

// Sanitize a single tag
export function sanitizeTag(tag: string): string {
  if (typeof tag !== 'string') {
    return '';
  }

  // Remove any HTML and trim whitespace
  const sanitized = sanitizeHTML(tag.trim());

  // Only allow alphanumeric characters, spaces, hyphens, and underscores
  return sanitized.replace(/[^\w\s-]/g, '').substring(0, 50); // Limit length
}

// Sanitize an array of tags
export function sanitizeTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map(tag => sanitizeTag(tag))
    .filter(tag => tag.length > 0) // Remove empty tags
    .slice(0, 10); // Limit to 10 tags
}

// Sanitize a title
export function sanitizeTitle(title: string): string {
  if (typeof title !== 'string') {
    return '';
  }

  // Remove HTML but allow some safe formatting
  const sanitized = sanitizeHTML(title);

  // Limit length and trim
  return sanitized.substring(0, 200).trim();
}

// Sanitize a description
export function sanitizeDescription(description: string): string {
  if (typeof description !== 'string') {
    return '';
  }

  // Remove dangerous HTML but allow some safe formatting
  const sanitized = description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');

  // Limit length
  return sanitized.substring(0, 1000);
}

// Validate date format
export function isValidDate(dateString: string): boolean {
  if (!dateString) return true; // Allow empty dates

  // Check if it's a valid ISO date string
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}