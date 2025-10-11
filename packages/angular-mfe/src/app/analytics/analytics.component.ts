import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { SharedServicesService } from '../services/shared-services.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  analyticsData: any = {};
  loading = true;
  selectedDateRange = '30d';
  realTimeEnabled = false;
  realtimeEvents: any[] = [];
  
  pageViews = [
    { page: '/products', views: 15420, change: '+12%' },
    { page: '/categories', views: 8930, change: '+8%' },
    { page: '/cart', views: 5670, change: '-3%' },
    { page: '/profile', views: 3450, change: '+15%' }
  ];
  
  userMetrics = {
    totalUsers: 12456,
    activeUsers: 3842,
    newUsers: 234,
    returningUsers: 3608
  };

  constructor(
    private analyticsService: AnalyticsService,
    private sharedServices: SharedServicesService
  ) { }

  ngOnInit(): void {
    this.loadAnalyticsData();
    this.trackEvents();
  }

  loadAnalyticsData() {
    this.loading = true;
    
    setTimeout(() => {
      this.analyticsData = this.analyticsService.getAnalyticsData();
      this.loading = false;
    }, 800);
  }

  trackEvents() {
    // Track events from other micro-frontends
    this.sharedServices.onEvent('product:addedToCart').subscribe((data: any) => {
      console.log('Analytics: Product added to cart', data);
      // Here you would send to analytics service
    });

    this.sharedServices.onEvent('user:loggedIn').subscribe((data: any) => {
      console.log('Analytics: User logged in', data);
    });
  }

  onDateRangeChange() {
    console.log('Date range changed to:', this.selectedDateRange);
    this.loadAnalyticsData();
  }

  toggleRealTime() {
    console.log('Real-time updates:', this.realTimeEnabled);
    if (this.realTimeEnabled) {
      this.startRealTimeTracking();
    }
  }

  clearEvents() {
    this.realtimeEvents = [];
  }

  trackByEventId(index: number, event: any): any {
    return event.id || index;
  }

  getEventIcon(eventType: string): string {
    const iconMap: { [key: string]: string } = {
      'user': '👤',
      'product': '🛍️',
      'navigation': '🧭',
      'system': '⚙️',
      'error': '⚠️'
    };
    return iconMap[eventType] || '📊';
  }

  private startRealTimeTracking() {
    // Listen to all events for real-time tracking
    this.sharedServices.onEvent('*').subscribe((data: any) => {
      this.addRealtimeEvent({
        id: Date.now(),
        type: data.type || 'system',
        source: data.source || 'Unknown',
        message: data.message || 'Event occurred',
        timestamp: new Date(),
        data: data.payload
      });
    });
  }

  private addRealtimeEvent(event: any) {
    this.realtimeEvents.unshift(event);
    if (this.realtimeEvents.length > 50) {
      this.realtimeEvents.pop();
    }
  }

  exportData() {
    this.sharedServices.emitEvent('analytics:dataExported', {
      timestamp: new Date().toISOString(),
      type: 'csv'
    });
    
    // Simulate export
    alert('Analytics data exported successfully!');
  }
}