import { Injectable } from '@angular/core';
import { SharedServicesService } from './shared-services.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private eventHistory: any[] = [];

  constructor(private sharedServices: SharedServicesService) {
    this.initializeEventTracking();
  }

  getAnalyticsData() {
    // Mock analytics data
    return {
      pageViews: {
        total: 45632,
        unique: 23456,
        bounceRate: 0.32,
        avgSessionDuration: '2m 34s'
      },
      userAcquisition: {
        organic: 15230,
        direct: 8945,
        social: 3456,
        referral: 2134,
        email: 1567
      },
      topPages: [
        { path: '/products', views: 15420, uniqueViews: 12300 },
        { path: '/categories', views: 8930, uniqueViews: 7200 },
        { path: '/cart', views: 5670, uniqueViews: 4500 },
        { path: '/profile', views: 3450, uniqueViews: 2800 }
      ],
      conversionFunnel: {
        visitors: 23456,
        productViews: 15420,
        addToCart: 5670,
        checkout: 2340,
        purchase: 1234
      },
      realtimeUsers: this.generateRandomNumber(200, 500),
      realtimeEvents: this.eventHistory.slice(-10)
    };
  }

  trackEvent(eventType: string, eventData: any) {
    const event = {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      source: 'angular-mfe',
      sessionId: this.generateSessionId()
    };

    this.eventHistory.push(event);
    
    // Keep only last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100);
    }

    // Send to analytics backend (mock)
    console.log('Analytics tracked:', event);
    
    return event;
  }

  getConversionRate() {
    const data = this.getAnalyticsData();
    return {
      overall: (data.conversionFunnel.purchase / data.conversionFunnel.visitors * 100).toFixed(2),
      productToCart: (data.conversionFunnel.addToCart / data.conversionFunnel.productViews * 100).toFixed(2),
      cartToCheckout: (data.conversionFunnel.checkout / data.conversionFunnel.addToCart * 100).toFixed(2),
      checkoutToPurchase: (data.conversionFunnel.purchase / data.conversionFunnel.checkout * 100).toFixed(2)
    };
  }

  exportAnalyticsData(format: 'csv' | 'json' = 'json') {
    const data = this.getAnalyticsData();
    
    // Emit export event
    this.sharedServices.emitEvent('analytics:dataExported', {
      format,
      timestamp: new Date().toISOString(),
      recordCount: Object.keys(data).length
    });

    // Mock export process
    return {
      success: true,
      filename: `analytics-export-${Date.now()}.${format}`,
      data: format === 'json' ? JSON.stringify(data, null, 2) : this.convertToCSV(data)
    };
  }

  private initializeEventTracking() {
    // Listen to cross-MFE events for analytics
    this.sharedServices.onEvent('product:addedToCart').subscribe((data: any) => {
      this.trackEvent('product_added_to_cart', data);
    });

    this.sharedServices.onEvent('user:loggedIn').subscribe((data: any) => {
      this.trackEvent('user_login', data);
    });

    this.sharedServices.onEvent('user:loggedOut').subscribe((data: any) => {
      this.trackEvent('user_logout', data);
    });

    this.sharedServices.onEvent('page:viewed').subscribe((data: any) => {
      this.trackEvent('page_view', data);
    });
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9);
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion for demo
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    ).join(',');
    
    return `${headers}\n${values}`;
  }
}