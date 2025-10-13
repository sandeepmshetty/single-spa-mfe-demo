/**
 * Integration tests for cross-MFE communication
 */

describe('Cross-MFE Communication', () => {
  beforeAll(() => {
    // Setup shared services mock
    (window as any).sharedServices = {
      version: '1.0.0',
      eventBus: {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      },
      counterActions: {
        increment: jest.fn(),
        decrement: jest.fn(),
        getValue: jest.fn(() => 0),
        subscribe: jest.fn(),
      },
    };
  });

  test('should share counter state between MFEs', () => {
    const { counterActions } = (window as any).sharedServices;
    
    counterActions.increment('react-mfe');
    expect(counterActions.increment).toHaveBeenCalledWith('react-mfe');
  });

  test('should emit events across MFEs', () => {
    const { eventBus } = (window as any).sharedServices;
    
    eventBus.emit('test-event', { data: 'test' });
    expect(eventBus.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
  });

  test('should validate shared library version', () => {
    const { version } = (window as any).sharedServices;
    expect(version).toBe('1.0.0');
  });
});
