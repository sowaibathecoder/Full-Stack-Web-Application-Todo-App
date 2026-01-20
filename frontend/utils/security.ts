/**
 * Security utilities for the frontend application
 */

/**
 * Check if the current request is coming from the same origin
 */
export function isSameOrigin(url: string): boolean {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.origin === window.location.origin;
  } catch (e) {
    console.warn('Invalid URL for same-origin check:', url);
    return false;
  }
}

/**
 * Generate a random string for use as a nonce or state parameter
 */
export function generateNonce(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a request is legitimate by checking origin
 */
export function verifyRequestOrigin(targetUrl: string): boolean {
  // For API calls, ensure they're going to our API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return false;
  }

  try {
    const apiEndpoint = new URL(apiUrl);
    const targetEndpoint = new URL(targetUrl, window.location.origin);

    // Check if the target is our API or a subdomain of our API host
    return targetEndpoint.hostname === apiEndpoint.hostname ||
           targetEndpoint.hostname.endsWith('.' + apiEndpoint.hostname);
  } catch (e) {
    console.error('Error verifying request origin:', e);
    return false;
  }
}

/**
 * Sanitize redirect URLs to prevent open redirect vulnerabilities
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[] = []): string {
  try {
    const parsedUrl = new URL(url, window.location.origin);

    // Only allow same-origin URLs by default
    if (parsedUrl.origin === window.location.origin) {
      return parsedUrl.toString();
    }

    // If allowed domains are specified, check against them
    if (allowedDomains.some(domain =>
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain))) {
      return parsedUrl.toString();
    }

    // Return a safe default
    return '/';
  } catch (e) {
    console.warn('Invalid redirect URL sanitized:', url);
    return '/';
  }
}