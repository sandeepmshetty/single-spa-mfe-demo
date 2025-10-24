/**
 * useCounter Hook
 * Custom hook for counter functionality with event bus integration
 */
import { useState, useEffect } from 'react';
import { counterService } from '../services';
import { getEventBus } from '../types/global';

interface UseCounterReturn {
  counter: number;
  lastSource: string;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounter = (source: string = 'react-mfe'): UseCounterReturn => {
  const [counter, setCounter] = useState(0);
  const [lastSource, setLastSource] = useState<string>('');

  useEffect(() => {
    // Initialize with current value
    setCounter(counterService.getValue());

    // Subscribe to counter changes
    const unsubscribeCounter = counterService.subscribe((value: number) => {
      setCounter(value);
    });

    // Subscribe to event bus for source tracking
    const eventBus = getEventBus();
    const unsubscribeEvents = eventBus?.onAll((payload: any) => {
      if (payload.type.startsWith('counter-')) {
        setLastSource(payload.source);
      }
    });

    return () => {
      unsubscribeCounter();
      unsubscribeEvents?.();
    };
  }, []);

  const increment = () => counterService.increment(source);
  const decrement = () => counterService.decrement(source);
  const reset = () => counterService.reset(source);

  return {
    counter,
    lastSource,
    increment,
    decrement,
    reset,
  };
};
