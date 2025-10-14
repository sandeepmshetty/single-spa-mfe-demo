import { Subject, BehaviorSubject } from 'rxjs';
import { IEventPayload, EventType } from './types';
import { EVENT_TYPES, MFE_NAMES } from './constants';

/**
 * Centralized event bus for communication between micro-frontends
 * Uses RxJS for reactive event handling
 */
export class EventBus {
  private eventSubject = new Subject<IEventPayload>();
  private debugMode = false;

  constructor(debug = false) {
    this.debugMode = debug;
    this.initializeGlobalListener();
  }

  /**
   * Emit an event to all subscribers
   */
  emit(type: EventType, data: any, source?: string): void {
    const payload: IEventPayload = {
      type,
      data,
      source: source || this.getCurrentMFE(),
      timestamp: new Date().toISOString()
    };

    if (this.debugMode) {
      console.log('📡 [EventBus] Emitting event:', payload);
    }

    // Emit to RxJS subscribers
    this.eventSubject.next(payload);

    // Also emit as DOM custom event for broader compatibility
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`mfe:${type}`, { 
        detail: payload 
      }));
    }
  }

  /**
   * Subscribe to specific event types
   */
  on(eventType: EventType, callback: (payload: IEventPayload) => void): () => void {
    const subscription = this.eventSubject.subscribe((payload) => {
      if (payload.type === eventType) {
        callback(payload);
      }
    });

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to all events
   */
  onAll(callback: (payload: IEventPayload) => void): () => void {
    const subscription = this.eventSubject.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to events from a specific micro-frontend
   */
  onFromSource(source: string, callback: (payload: IEventPayload) => void): () => void {
    const subscription = this.eventSubject.subscribe((payload) => {
      if (payload.source === source) {
        callback(payload);
      }
    });

    return () => subscription.unsubscribe();
  }

  /**
   * Initialize global DOM event listener for cross-MFE communication
   */
  private initializeGlobalListener(): void {
    if (typeof window !== 'undefined') {
      // Listen for events from other MFEs that might not use this event bus
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type && event.data.type.startsWith('mfe:')) {
          const type = event.data.type.replace('mfe:', '') as EventType;
          this.emit(type, event.data.payload, event.data.source);
        }
      });
    }
  }

  /**
   * Get current micro-frontend name
   */
  private getCurrentMFE(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('react')) {
      return MFE_NAMES.REACT;
    }
    if (hostname.includes('vue')) {
      return MFE_NAMES.VUE;
    }
    if (hostname.includes('angular')) {
      return MFE_NAMES.ANGULAR;
    }
    if (hostname.includes('shared')) {
      return MFE_NAMES.SHARED;
    }
    
    // Check for localhost development
    const port = window.location.port;
    switch (port) {
    case '9000': return MFE_NAMES.SHELL;
    case '3001': return MFE_NAMES.REACT;
    case '3002': return MFE_NAMES.VUE;
    case '3003': return MFE_NAMES.ANGULAR;
    case '3004': return MFE_NAMES.SHARED;
    default: return MFE_NAMES.SHELL;
    }
  }

  /**
   * Clear all subscriptions
   */
  destroy(): void {
    this.eventSubject.complete();
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
}

// Create and export singleton instance
export const eventBus = new EventBus(
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
);