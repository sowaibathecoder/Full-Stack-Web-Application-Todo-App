/**
 * Utility functions for handling redirects in the application
 */

// Get the redirect URL from query params or sessionStorage
export function getRedirectUrl(defaultUrl: string = '/'): string {
  // Check for redirect in URL query parameters
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');

    if (redirectParam) {
      try {
        // Verify it's a safe redirect (same origin)
        const redirectUrl = new URL(redirectParam, window.location.origin);
        if (redirectUrl.origin === window.location.origin) {
          return redirectUrl.pathname + redirectUrl.search + redirectUrl.hash;
        }
      } catch (e) {
        console.warn('Invalid redirect URL provided:', redirectParam);
      }
    }

    // Check for redirect in sessionStorage
    const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
    if (storedRedirect) {
      sessionStorage.removeItem('redirectAfterLogin'); // Clear after retrieving
      try {
        const redirectUrl = new URL(storedRedirect, window.location.origin);
        if (redirectUrl.origin === window.location.origin) {
          return redirectUrl.pathname + redirectUrl.search + redirectUrl.hash;
        }
      } catch (e) {
        console.warn('Invalid stored redirect URL:', storedRedirect);
      }
    }
  }

  return defaultUrl;
}

// Store redirect URL for later use after login
export function storeRedirectUrl(url?: string): void {
  if (typeof window !== 'undefined' && url) {
    try {
      // Only store same-origin URLs
      const redirectUrl = new URL(url, window.location.origin);
      if (redirectUrl.origin === window.location.origin) {
        sessionStorage.setItem('redirectAfterLogin', url);
      }
    } catch (e) {
      console.warn('Invalid URL to store for redirect:', url);
    }
  }
}

// Clear stored redirect URL
export function clearRedirectUrl(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('redirectAfterLogin');
  }
}