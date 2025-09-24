import { useEffect } from 'react';

// Performance monitoring utility for development
export const performanceMonitor = {
  marks: new Map<string, number>(),

  start(label: string) {
    this.marks.set(label, performance.now());
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Started: ${label}`);
    }
  },

  end(label: string) {
    const startTime = this.marks.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.marks.delete(label);

      if (process.env.NODE_ENV === 'development') {
        const emoji = duration < 100 ? '⚡' : duration < 500 ? '✅' : '🐌';
        console.log(`${emoji} ${label}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    }
    return 0;
  },

  measure(label: string, fn: () => any) {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  },
};

// Hook for measuring component render time
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    performanceMonitor.start(`${componentName} render`);
    return () => {
      performanceMonitor.end(`${componentName} render`);
    };
  });
};
