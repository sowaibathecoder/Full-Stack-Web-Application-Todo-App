/**
 * Rate limiting utilities to prevent API abuse
 */

interface RateLimitInfo {
  lastCall: number;
  count: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitInfo> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) { // 1 minute window, 10 requests
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public isAllowed(key: string): boolean {
    const now = Date.now();
    const limitInfo = this.limits.get(key);

    if (!limitInfo) {
      // First call for this key
      this.limits.set(key, { lastCall: now, count: 1 });
      return true;
    }

    // Check if we're in a new window
    if (now - limitInfo.lastCall >= this.windowMs) {
      this.limits.set(key, { lastCall: now, count: 1 });
      return true;
    }

    // Check if we've exceeded the limit
    if (limitInfo.count >= this.maxRequests) {
      return false;
    }

    // Increment the count
    this.limits.set(key, {
      lastCall: limitInfo.lastCall,
      count: limitInfo.count + 1
    });

    return true;
  }

  public async delayIfRateLimited(key: string, delayMs: number = 1000): Promise<void> {
    if (!this.isAllowed(key)) {
      // Wait before allowing the request
      await new Promise(resolve => setTimeout(resolve, delayMs));
      // Reset the counter after waiting
      this.limits.set(key, { lastCall: Date.now(), count: 1 });
    }
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter(60000, 10); // 10 requests per minute

/**
 * Rate limit an API call
 * @param key A unique key for the rate limit (e.g., 'api_task_create')
 * @param fn The function to call if not rate limited
 * @param delayMs Delay in milliseconds if rate limited
 */
export async function rateLimitCall<T>(
  key: string,
  fn: () => Promise<T>,
  delayMs: number = 1000
): Promise<T> {
  await globalRateLimiter.delayIfRateLimited(key, delayMs);
  return fn();
}

export { RateLimiter };