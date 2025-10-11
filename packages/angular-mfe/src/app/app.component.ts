import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServicesService } from './services/shared-services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular MFE - Dashboard & Analytics';
  currentUser: any = null;
  isEmbedded = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private sharedServices: SharedServicesService
  ) {
    // Check if running as embedded micro-frontend
    this.isEmbedded = window.location.pathname.includes('/angular-mfe') || 
                     window.location.port !== '3003';
  }

  ngOnInit() {
    // Initialize shared services connection
    this.sharedServices.initialize();

    // Listen to authentication events from other MFEs
    const authSub = this.sharedServices.onEvent('user:loggedIn').subscribe((data: any) => {
      this.currentUser = data.user;
      console.log('User logged in from another MFE:', data);
    });

    const logoutSub = this.sharedServices.onEvent('user:loggedOut').subscribe(() => {
      this.currentUser = null;
      console.log('User logged out from another MFE');
    });

    // Listen to cart events for analytics
    const cartSub = this.sharedServices.onEvent('product:addedToCart').subscribe((data: any) => {
      console.log('Product added to cart (Analytics):', data);
      // Here you would typically send analytics data
    });

    this.subscriptions.push(authSub, logoutSub, cartSub);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  emitTestEvent() {
    this.sharedServices.emitEvent('angular:testEvent', {
      message: 'Hello from Angular MFE!',
      timestamp: new Date().toISOString()
    });
  }
}