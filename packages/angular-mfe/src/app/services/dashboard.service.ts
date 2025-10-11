import { Injectable } from '@angular/core';
import { SharedServicesService } from './shared-services.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private sharedServices: SharedServicesService) { }

  getDashboardData() {
    // Mock dashboard data
    return {
      summary: {
        totalUsers: this.generateRandomNumber(10000, 15000),
        activeSessions: this.generateRandomNumber(3000, 5000),
        revenue: this.generateRandomNumber(80000, 100000),
        orders: this.generateRandomNumber(1000, 1500)
      },
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Users',
            data: [1200, 1900, 3000, 5000, 2000, 3000]
          },
          {
            label: 'Revenue',
            data: [2800, 4800, 4000, 1900, 8600, 2700]
          }
        ]
      },
      recentActivities: [
        {
          id: 1,
          action: 'New user registration',
          user: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 2,
          action: 'Order completed',
          user: 'jane.smith@example.com',
          timestamp: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: 3,
          action: 'Product viewed',
          user: 'bob.wilson@example.com',
          timestamp: new Date(Date.now() - 900000).toISOString()
        }
      ]
    };
  }

  getSystemStatus() {
    return {
      apiServer: { status: 'online', responseTime: '45ms' },
      database: { status: 'online', responseTime: '23ms' },
      cache: { status: 'warning', responseTime: '156ms' },
      cdn: { status: 'online', responseTime: '12ms' }
    };
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  refreshDashboard() {
    // Emit event when dashboard is refreshed
    this.sharedServices.emitEvent('dashboard:refreshed', {
      timestamp: new Date().toISOString(),
      source: 'angular-mfe'
    });
    
    return this.getDashboardData();
  }
}