// Rate limiter for Jikan API
// Jikan API limits: 3 requests per second, 60 requests per minute

class RateLimiter {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private readonly delay: number;
  private lastRequestTime = 0;

  constructor(requestsPerSecond: number = 2) {
    // Use 2 requests per second to be safe (Jikan allows 3)
    this.delay = 1000 / requestsPerSecond;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.delay) {
        await this.sleep(this.delay - timeSinceLastRequest);
      }

      const task = this.queue.shift();
      if (task) {
        this.lastRequestTime = Date.now();
        await task();
      }
    }

    this.isProcessing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create a singleton instance
export const jikanRateLimiter = new RateLimiter(2); // 2 requests per second
