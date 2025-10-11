import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

declare global {
  interface Window {
    sharedServices?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {
  private eventSubject = new Subject<{ type: string; data: any }>();
  private sharedServices: any = null;

  constructor() {
    this.initialize();
  }

  initialize() {
    // Try to get shared services from window object (set by shell app)
    if (window.sharedServices) {
      this.sharedServices = window.sharedServices;
      console.log('Angular MFE: Connected to shared services');
      
      // Listen to shared events
      if (this.sharedServices.eventBus) {
        this.sharedServices.eventBus.on('*', (eventType: string, data: any) => {
          this.eventSubject.next({ type: eventType, data });
        });
      }
    } else {
      console.warn('Angular MFE: Shared services not available');
      // Retry after a short delay
      setTimeout(() => this.initialize(), 1000);
    }
  }

  onEvent(eventType: string): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.type === eventType),
      map(event => event.data)
    );
  }

  emitEvent(eventType: string, data: any) {
    if (this.sharedServices?.eventBus) {
      this.sharedServices.eventBus.emit(eventType, data);
      console.log(`Angular MFE: Emitted event ${eventType}`, data);
    } else {
      console.warn('Angular MFE: Cannot emit event, shared services not available');
    }
  }

  getAuthService() {
    return this.sharedServices?.authService;
  }

  getApiClient() {
    return this.sharedServices?.apiClient;
  }

  getStorageService() {
    return this.sharedServices?.storageService;
  }

  getLogger() {
    return this.sharedServices?.logger;
  }
}