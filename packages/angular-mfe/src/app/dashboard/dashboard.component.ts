import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SharedServicesService } from '../services/shared-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: any = {};
  loading = true;
  counter = 0;
  lastSource = '';
  
  metrics = [
    { title: 'Total Users', value: '12,456', icon: 'people', color: 'primary' },
    { title: 'Active Sessions', value: '3,842', icon: 'laptop', color: 'accent' },
    { title: 'Revenue', value: '$89,432', icon: 'attach_money', color: 'warn' },
    { title: 'Orders', value: '1,234', icon: 'shopping_cart', color: 'primary' }
  ];
  
  recentActivities = [
    { action: 'User John logged in', time: '2 minutes ago', icon: 'login' },
    { action: 'Order #1234 completed', time: '5 minutes ago', icon: 'shopping_bag' },
    { action: 'Product added to cart', time: '8 minutes ago', icon: 'add_shopping_cart' },
    { action: 'User Sarah registered', time: '12 minutes ago', icon: 'person_add' },
    { action: 'Payment processed', time: '15 minutes ago', icon: 'payment' }
  ];

  private counterUnsubscribe?: () => void;
  private eventsUnsubscribe?: () => void;

  constructor(
    private dashboardService: DashboardService,
    private sharedServices: SharedServicesService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.listenToEvents();
    this.subscribeToCounter();
  }

  ngOnDestroy(): void {
    if (this.counterUnsubscribe) {
      this.counterUnsubscribe();
    }
    if (this.eventsUnsubscribe) {
      this.eventsUnsubscribe();
    }
  }

  subscribeToCounter(): void {
    const counterActions = (window as any).sharedServices?.counterActions;
    const eventBus = (window as any).sharedServices?.eventBus;

    if (counterActions && eventBus) {
      // Initialize with current value
      this.counter = counterActions.getValue();

      // Subscribe to counter changes
      this.counterUnsubscribe = counterActions.subscribe((value: number) => {
        this.counter = value;
      });

      // Track source of updates
      this.eventsUnsubscribe = eventBus.onAll((payload: any) => {
        if (payload.type.startsWith('counter-')) {
          this.lastSource = payload.source;
        }
      });

      console.log('✅ Angular MFE: Connected to shared counter state');
    } else {
      console.warn('⚠️ Angular MFE: Shared services not available');
    }
  }

  loadDashboardData() {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.dashboardData = this.dashboardService.getDashboardData();
      this.loading = false;
    }, 1000);
  }

  listenToEvents() {
    // Listen to events from other micro-frontends
    this.sharedServices.onEvent('product:addedToCart').subscribe((data: any) => {
      this.addActivity(`Product "${data.productName || 'Unknown'}" added to cart`, 'just now', 'add_shopping_cart');
    });

    this.sharedServices.onEvent('user:loggedIn').subscribe((data: any) => {
      this.addActivity(`User ${data.username || 'Unknown'} logged in`, 'just now', 'login');
    });
  }

  private addActivity(action: string, time: string, icon: string) {
    this.recentActivities.unshift({ action, time, icon });
    if (this.recentActivities.length > 5) {
      this.recentActivities.pop();
    }
  }

  refreshData() {
    this.loadDashboardData();
    
    // Emit event to notify other MFEs
    this.sharedServices.emitEvent('dashboard:refreshed', {
      timestamp: new Date().toISOString()
    });
  }

  getMetricIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'people': '👥',
      'laptop': '💻',
      'shopping_cart': '🛒',
      'attach_money': '💰',
      'trending_up': '📈',
      'bar_chart': '📊'
    };
    return iconMap[iconName] || '📊';
  }

  getActivityIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'login': '🔐',
      'shopping_bag': '🛍️',
      'add_shopping_cart': '🛒➕',
      'person_add': '👤➕',
      'payment': '💳'
    };
    return iconMap[iconName] || '📋';
  }
}