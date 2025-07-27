'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, Zap, AlertTriangle, RefreshCw } from 'lucide-react'
import { performanceMonitor } from '@/lib/performance-monitor'

interface PerformanceDashboardProps {
  isVisible: boolean
  onClose: () => void
}

export default function PerformanceDashboard({ isVisible, onClose }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics())
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible])

  const handleRefresh = () => {
    setIsRefreshing(true)
    performanceMonitor.reset()
    setMetrics(performanceMonitor.getMetrics())
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 2000) return 'text-green-600'
    if (time < 5000) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border p-4 w-80 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          LLM Performance
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Total Requests */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Requests:</span>
          <span className="font-semibold">{metrics.totalRequests}</span>
        </div>

        {/* Cache Hit Rate */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Cache Hit Rate:</span>
          <span className={`font-semibold ${getPerformanceColor(performanceMonitor.getCacheHitRate())}`}>
            {performanceMonitor.getCacheHitRate().toFixed(1)}%
          </span>
        </div>

        {/* Average Response Time */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg Response Time:</span>
          <span className={`font-semibold ${getResponseTimeColor(metrics.averageResponseTime)}`}>
            {metrics.averageResponseTime.toFixed(0)}ms
          </span>
        </div>

        {/* Errors */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Errors:</span>
          <span className={`font-semibold ${metrics.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {metrics.errors}
          </span>
        </div>

        {/* Last Request */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Request:</span>
          <span className="text-xs text-gray-500">
            {metrics.lastRequestTime > 0 
              ? new Date(metrics.lastRequestTime).toLocaleTimeString()
              : 'Never'
            }
          </span>
        </div>

        {/* Performance Indicators */}
        <div className="pt-2 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-3 h-3 text-green-600" />
              </div>
              <div className="text-gray-600">Cache Hits</div>
              <div className="font-semibold">{metrics.cacheHits}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-gray-600">Response Time</div>
              <div className="font-semibold">{metrics.averageResponseTime.toFixed(0)}ms</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
              </div>
              <div className="text-gray-600">Errors</div>
              <div className="font-semibold">{metrics.errors}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 