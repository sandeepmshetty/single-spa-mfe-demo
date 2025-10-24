/**
 * Health Check Service
 * Monitors system health and service availability
 */

import type { SharedServices } from '@/types';

export class HealthCheckService {
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  async performHealthCheck(sharedServices: SharedServices): Promise<void> {
    const healthDot = document.getElementById('health-dot');
    const healthStatus = document.getElementById('health-status');

    if (!healthDot || !healthStatus) {
      return;
    }

    try {
      const sharedLibLoaded = System.has('@single-spa-demo/shared-library');
      const supabaseConfigured = sharedServices.isSupabaseConfigured
        ? sharedServices.isSupabaseConfigured()
        : false;

      if (sharedLibLoaded && supabaseConfigured) {
        healthDot.className = 'health-dot';
        healthStatus.textContent = 'All Systems Operational';
      } else {
        healthDot.className = 'health-dot warning';
        healthStatus.textContent = 'Some Issues Detected';
      }
    } catch (error) {
      console.error('Health check failed:', error);
      healthDot.className = 'health-dot error';
      healthStatus.textContent = 'System Issues';
    }
  }

  startPeriodicChecks(sharedServices: SharedServices, intervalMs = 30000): void {
    this.performHealthCheck(sharedServices);
    this.checkInterval = globalThis.setInterval(
      () => this.performHealthCheck(sharedServices),
      intervalMs
    );
  }

  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const healthCheckService = new HealthCheckService();
