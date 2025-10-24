/**
 * CounterService
 * Centralized counter service layer
 * Handles counter state management logic
 */
import { getCounterActions } from '../types/global';

export class CounterService {
  private get counterActions() {
    return getCounterActions();
  }

  /**
   * Get current counter value
   */
  getValue(): number {
    return this.counterActions?.getValue() ?? 0;
  }

  /**
   * Increment counter
   */
  increment(source: string = 'react-mfe'): void {
    this.counterActions?.increment(source);
  }

  /**
   * Decrement counter
   */
  decrement(source: string = 'react-mfe'): void {
    this.counterActions?.decrement(source);
  }

  /**
   * Reset counter to zero
   */
  reset(source: string = 'react-mfe'): void {
    this.counterActions?.reset(source);
  }

  /**
   * Subscribe to counter changes
   */
  subscribe(callback: (value: number) => void): () => void {
    const unsubscribe = this.counterActions?.subscribe(callback);
    return unsubscribe || (() => {});
  }
}

// Export singleton instance
export const counterService = new CounterService();
