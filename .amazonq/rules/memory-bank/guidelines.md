# Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict Typing**: All code uses TypeScript with explicit type definitions
- **Interface Definitions**: Define interfaces for contracts (e.g., MFELifecycle, shared services)
- **No Implicit Any**: Avoid `any` types; use proper type annotations
- **Type Safety**: Use type guards and assertions when necessary (e.g., `(window as any)` for global objects)

### File Organization
- **Test Files**: Use `.test.ts` suffix for test files
- **Configuration Files**: Use `.config.js` or `.config.ts` for configuration
- **Type Definitions**: Place type definitions in `types/` directories or inline with interfaces

### Documentation Standards
- **JSDoc Comments**: Use JSDoc-style comments for file-level documentation
- **Descriptive Headers**: Start files with purpose comments (e.g., `/** Contract tests for MFE interfaces */`)
- **Inline Comments**: Use comments sparingly; prefer self-documenting code
- **Emoji Indicators**: Use emojis in console output for visual clarity (✅, ❌, ⏳)

### Naming Conventions
- **camelCase**: Functions, variables, methods (e.g., `waitForSonar`, `counterActions`)
- **PascalCase**: Interfaces, types, classes (e.g., `MFELifecycle`)
- **UPPER_SNAKE_CASE**: Constants (e.g., `MAX_RETRIES`, `RETRY_INTERVAL`)
- **kebab-case**: File names for tests (e.g., `contract-tests.test.ts`, `mfe-communication.test.ts`)

## Testing Patterns

### Test Structure
- **Describe Blocks**: Group related tests with descriptive names
  ```typescript
  describe('MFE Contract Tests', () => {
    test('React MFE should export valid lifecycle methods', async () => {
      // Test implementation
    });
  });
  ```

### Jest Configuration
- **Preset**: Use `ts-jest` for TypeScript support
- **Environment**: Use `jsdom` for browser-like environment
- **Coverage**: Collect coverage from `packages/**/src/**/*.{ts,tsx}`
- **Exclusions**: Exclude `.d.ts` files and `node_modules` from coverage

### Mock Patterns
- **Jest Mocks**: Use `jest.fn()` for function mocking
- **Resolved Promises**: Use `mockResolvedValue(undefined)` for async functions
- **Global Mocks**: Mock global objects like `window.sharedServices` in `beforeAll`
  ```typescript
  beforeAll(() => {
    (window as any).sharedServices = {
      version: '1.0.0',
      eventBus: { emit: jest.fn(), on: jest.fn(), off: jest.fn() }
    };
  });
  ```

### Contract Testing
- **Lifecycle Validation**: All MFEs must export `bootstrap`, `mount`, `unmount` methods
- **Interface Compliance**: Verify all required methods return `Promise<void>`
- **Type Checking**: Use `typeof` to validate function types
- **Async Assertions**: Use `await expect().resolves.toBeUndefined()` for promises

### Integration Testing
- **Cross-MFE Communication**: Test event bus and shared state
- **Mock Shared Services**: Mock `window.sharedServices` for isolated testing
- **Call Verification**: Use `toHaveBeenCalledWith()` to verify function calls
- **State Validation**: Test shared counter and event emission

## Architectural Patterns

### Single-SPA Lifecycle
All micro-frontends must implement the Single-SPA lifecycle interface:
```typescript
interface MFELifecycle {
  bootstrap: (props?: any) => Promise<void>;
  mount: (props?: any) => Promise<void>;
  unmount: (props?: any) => Promise<void>;
}
```

### Shared Services Pattern
Shared library exposes global services via `window.sharedServices`:
```typescript
window.sharedServices = {
  version: string;
  versionInfo: { version: string; compatible: (v: string) => boolean };
  eventBus: { emit: Function; on: Function; off: Function };
  counterActions: { increment: Function; decrement: Function; reset: Function; getValue: Function; subscribe: Function };
}
```

### Event-Driven Communication
- **Event Bus**: Use shared event bus for cross-MFE communication
- **Event Emission**: `eventBus.emit(eventName, payload)`
- **Event Subscription**: `eventBus.on(eventName, handler)`
- **Event Cleanup**: `eventBus.off(eventName, handler)` in unmount

### State Management
- **Shared Counter**: Use `counterActions` for shared state across MFEs
- **Source Tracking**: Pass source identifier (e.g., `'react-mfe'`) to actions
- **Subscription Pattern**: Use `subscribe()` for state change notifications
- **Getter Pattern**: Use `getValue()` for current state retrieval

## Error Handling

### Async Operations
- **Promise-Based**: All async operations return Promises
- **Error Propagation**: Use `.catch()` for error handling
- **Process Exit**: Exit with code 1 on critical failures
  ```javascript
  waitForSonar().catch((error) => {
    console.error('❌ Failed to connect:', error.message);
    process.exit(1);
  });
  ```

### Retry Logic
- **Configurable Retries**: Use constants for max retries and intervals
- **Exponential Backoff**: Use `setTimeout()` for retry delays
- **Progress Feedback**: Log retry attempts with counters
- **Graceful Degradation**: Reject after max retries exceeded

### HTTP Error Handling
- **Request Errors**: Handle both response errors and connection errors
- **Status Validation**: Parse and validate response status (e.g., `status === 'UP'`)
- **JSON Parsing**: Wrap JSON.parse in try-catch blocks

## Node.js Script Patterns

### HTTP Requests
- **Native HTTP**: Use Node.js `http` module for simple requests
- **Promise Wrapper**: Wrap HTTP requests in Promises
- **Stream Handling**: Use `res.on('data')` and `res.on('end')` for response handling
- **Error Events**: Handle `req.on('error')` for connection failures

### Recursive Async Functions
```javascript
async function waitForSonar(retries = 0) {
  return new Promise((resolve, reject) => {
    // Implementation with retry logic
    if (retries < MAX_RETRIES) {
      setTimeout(() => {
        waitForSonar(retries + 1).then(resolve).catch(reject);
      }, RETRY_INTERVAL);
    }
  });
}
```

### Console Output
- **Visual Indicators**: Use emojis for status (✅ success, ❌ error, ⏳ waiting)
- **Progress Tracking**: Show current/total attempts (e.g., `(1/60)`)
- **Error Messages**: Use `console.error()` for errors, `console.log()` for info

## Configuration Patterns

### Environment-Based Config
- **Development Detection**: Check `window.location.hostname` for localhost
- **Environment Variables**: Use `process.env` for production URLs with fallbacks
- **Config Objects**: Organize configs by environment
  ```typescript
  export const MFE_CONFIG = {
    development: { 'react-mfe': 'http://localhost:3001/react-mfe.js' },
    production: { 'react-mfe': process.env.REACT_MFE_URL || 'https://...' }
  };
  ```

### Jest Configuration
- **Module Resolution**: Use `<rootDir>` for relative paths
- **Test Matching**: Use glob patterns for test discovery
- **Coverage Paths**: Use glob patterns with exclusions for coverage collection

## Best Practices

### Code Organization
- **Single Responsibility**: Each file has one clear purpose
- **Separation of Concerns**: Tests separate from implementation
- **Configuration Centralization**: Centralize configs in dedicated files

### Testing Best Practices
- **Test Isolation**: Each test should be independent
- **Mock External Dependencies**: Mock all external services and APIs
- **Descriptive Test Names**: Use clear, descriptive test names
- **Arrange-Act-Assert**: Follow AAA pattern in tests

### Async/Await Usage
- **Prefer Async/Await**: Use async/await over raw Promises where possible
- **Error Handling**: Always handle Promise rejections
- **Test Async Code**: Use `await expect().resolves` for async assertions

### Version Management
- **Semantic Versioning**: Use semver for package versions
- **Version Compatibility**: Implement version checking in shared services
- **Version Exposure**: Expose version info in shared libraries

### Performance Considerations
- **Retry Intervals**: Use reasonable intervals (5 seconds) for retries
- **Max Retries**: Set sensible limits (60 retries = 5 minutes)
- **Timeout Handling**: Implement timeouts for long-running operations

## Code Review Checklist
- [ ] TypeScript types are explicit and correct
- [ ] Tests follow naming conventions (`.test.ts`)
- [ ] Async functions return Promises
- [ ] Error handling is implemented
- [ ] Console output uses visual indicators
- [ ] Mocks are properly configured in tests
- [ ] Single-SPA lifecycle methods are implemented
- [ ] Shared services interface is respected
- [ ] Configuration supports multiple environments
- [ ] Code is documented with JSDoc comments
