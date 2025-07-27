interface PerformanceMetrics {
  totalRequests: number
  cacheHits: number
  averageResponseTime: number
  lastRequestTime: number
  errors: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    averageResponseTime: 0,
    lastRequestTime: 0,
    errors: 0
  }

  private responseTimes: number[] = []

  // Track a new request
  trackRequest(startTime: number, endTime: number, wasCacheHit: boolean = false) {
    const responseTime = endTime - startTime
    
    this.metrics.totalRequests++
    this.metrics.lastRequestTime = Date.now()
    
    if (wasCacheHit) {
      this.metrics.cacheHits++
    } else {
      this.responseTimes.push(responseTime)
      // Keep only last 100 response times for average calculation
      if (this.responseTimes.length > 100) {
        this.responseTimes = this.responseTimes.slice(-100)
      }
      
      this.metrics.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
    }
  }

  // Track an error
  trackError() {
    this.metrics.errors++
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Get cache hit rate
  getCacheHitRate(): number {
    if (this.metrics.totalRequests === 0) return 0
    return (this.metrics.cacheHits / this.metrics.totalRequests) * 100
  }

  // Reset metrics
  reset() {
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      averageResponseTime: 0,
      lastRequestTime: 0,
      errors: 0
    }
    this.responseTimes = []
  }

  // Log metrics to console
  logMetrics() {
    console.log('LLM Performance Metrics:', {
      totalRequests: this.metrics.totalRequests,
      cacheHits: this.metrics.cacheHits,
      cacheHitRate: `${this.getCacheHitRate().toFixed(2)}%`,
      averageResponseTime: `${this.metrics.averageResponseTime.toFixed(2)}ms`,
      errors: this.metrics.errors,
      lastRequest: new Date(this.metrics.lastRequestTime).toLocaleTimeString()
    })
  }
}

export const performanceMonitor = new PerformanceMonitor() 