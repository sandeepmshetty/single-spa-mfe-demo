import { BehaviorSubject, Observable } from 'rxjs';
import { eventBus } from './event-bus';
import { EVENT_TYPES } from './constants';

/**
 * Shared state manager for cross-MFE reactive state
 * Uses RxJS BehaviorSubject for real-time synchronization
 */
export class SharedState<T> {
  private state$: BehaviorSubject<T>;
  
  constructor(initialValue: T, private stateName: string) {
    this.state$ = new BehaviorSubject<T>(initialValue);
  }

  /**
   * Get current state value
   */
  getValue(): T {
    return this.state$.getValue();
  }

  /**
   * Set new state value and broadcast to all MFEs
   */
  setValue(value: T, source?: string): void {
    this.state$.next(value);
    
    // Emit event for MFEs that don't subscribe to observables
    eventBus.emit(`${this.stateName}-update`, value, source);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (value: T) => void): () => void {
    const subscription = this.state$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Get observable for reactive frameworks
   */
  asObservable(): Observable<T> {
    return this.state$.asObservable();
  }

  /**
   * Update state with a function
   */
  update(updateFn: (current: T) => T, source?: string): void {
    const newValue = updateFn(this.getValue());
    this.setValue(newValue, source);
  }

  /**
   * Reset to initial value
   */
  reset(initialValue: T, source?: string): void {
    this.setValue(initialValue, source);
  }
}

/**
 * Counter state for cross-MFE demo
 */
export const counterState = new SharedState<number>(0, 'counter');

/**
 * Helper functions for counter operations
 */
export const counterActions = {
  increment: (source?: string) => {
    const newValue = counterState.getValue() + 1;
    counterState.setValue(newValue, source);
    eventBus.emit(EVENT_TYPES.COUNTER_INCREMENT, newValue, source);
  },
  
  decrement: (source?: string) => {
    const newValue = counterState.getValue() - 1;
    counterState.setValue(newValue, source);
    eventBus.emit(EVENT_TYPES.COUNTER_DECREMENT, newValue, source);
  },
  
  reset: (source?: string) => {
    counterState.setValue(0, source);
    eventBus.emit(EVENT_TYPES.COUNTER_RESET, 0, source);
  },
  
  setValue: (value: number, source?: string) => {
    counterState.setValue(value, source);
    eventBus.emit(EVENT_TYPES.COUNTER_SYNC, value, source);
  },
  
  getValue: () => counterState.getValue(),
  
  subscribe: (callback: (value: number) => void) => counterState.subscribe(callback)
};

/**
 * User state for authentication demo
 */
interface IUserState {
  id: string | null;
  name: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

export const userState = new SharedState<IUserState>(
  {
    id: null,
    name: null,
    email: null,
    isAuthenticated: false
  },
  'user'
);

export const userActions = {
  login: (user: { id: string; name: string; email: string }, source?: string) => {
    userState.setValue({ ...user, isAuthenticated: true }, source);
    eventBus.emit(EVENT_TYPES.AUTH_LOGIN, user, source);
  },
  
  logout: (source?: string) => {
    userState.setValue({
      id: null,
      name: null,
      email: null,
      isAuthenticated: false
    }, source);
    eventBus.emit(EVENT_TYPES.AUTH_LOGOUT, null, source);
  },
  
  updateProfile: (updates: Partial<IUserState>, source?: string) => {
    const current = userState.getValue();
    userState.setValue({ ...current, ...updates }, source);
    eventBus.emit(EVENT_TYPES.USER_PROFILE_UPDATE, updates, source);
  },
  
  getUser: () => userState.getValue(),
  
  subscribe: (callback: (user: IUserState) => void) => userState.subscribe(callback)
};
