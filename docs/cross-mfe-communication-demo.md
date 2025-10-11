# Cross-MFE Communication Demo

## ✅ What's Implemented

Real-time state synchronization across React, Vue, and Angular micro-frontends using:

### 1. **Shared State Management** (`shared-library/src/shared-state.ts`)
- `SharedState` class using RxJS `BehaviorSubject` for reactive updates
- `counterState`: Shared counter accessible by all MFEs
- `counterActions`: Helper functions for increment/decrement/reset/sync
- `userState` & `userActions`: User authentication state (ready for expansion)

### 2. **Event Bus Integration**
- All state changes emit events via the existing event bus
- MFEs can subscribe via observables OR event listeners
- Source tracking shows which MFE triggered the update

### 3. **React MFE** (`packages/react-mfe/src/App.tsx`)
- **Interactive controls**: Increment (+), Decrement (-), Reset buttons
- **Real-time display**: Shows current counter value
- **Source tracking**: Displays which MFE last modified the counter
- **Lifecycle management**: Proper subscribe/unsubscribe in useEffect

### 4. **Vue MFE** (`packages/vue-mfe/src/App.vue`)
- **Read-only display**: Shows counter in real-time
- **Visual feedback**: Large counter badge with Vue styling
- **Reactive updates**: Uses Vue 3 Composition API with ref()
- **Hint message**: Tells users to go to React MFE to modify

### 5. **Angular MFE** (`packages/angular-mfe/src/app/dashboard/`)
- **Dashboard integration**: Counter displayed at top of dashboard
- **Purple gradient card**: Distinct visual styling
- **NgOnDestroy cleanup**: Proper unsubscribe to prevent memory leaks
- **Source tracking**: Shows which MFE last updated the counter

## 🎯 How It Works

```
User clicks [+] in React MFE
    ↓
counterActions.increment('react-mfe')
    ↓
SharedState updates BehaviorSubject
    ↓
Event bus emits 'counter-increment'
    ↓
All subscribed MFEs receive update
    ↓
React/Vue/Angular UIs update instantly
```

## 🚀 Try It Live

1. **Start all services**:
   ```powershell
   npm run dev
   ```

2. **Open the shell**: http://localhost:9000

3. **Navigate between MFEs**:
   - Go to **React MFE** → Click `+` or `-` buttons
   - Switch to **Vue MFE** → See counter update
   - Switch to **Angular Dashboard** → Counter synced there too!

4. **Watch real-time updates**:
   - Each MFE shows "Last updated by: react-mfe" (or vue-mfe, angular-mfe)
   - Counter value is identical across all three apps
   - No page refresh needed!

## 📚 Technical Details

### Event Types Added
```typescript
COUNTER_INCREMENT: 'counter-increment'
COUNTER_DECREMENT: 'counter-decrement'
COUNTER_RESET: 'counter-reset'
COUNTER_SYNC: 'counter-sync'
```

### State Architecture
```typescript
counterState = new SharedState<number>(0, 'counter')
// Uses RxJS BehaviorSubject internally
// Accessible via counterState.getValue(), .setValue(), .subscribe()
```

### Framework Integration

**React (Hooks)**:
```typescript
const [counter, setCounter] = useState(0);
useEffect(() => {
  const unsubscribe = counterActions.subscribe(setCounter);
  return unsubscribe;
}, []);
```

**Vue (Composition API)**:
```typescript
const counter = ref(0);
onMounted(() => {
  unsubscribe = counterActions.subscribe((value) => {
    counter.value = value;
  });
});
```

**Angular (RxJS)**:
```typescript
ngOnInit() {
  this.counterUnsubscribe = counterActions.subscribe((value) => {
    this.counter = value;
  });
}
ngOnDestroy() {
  this.counterUnsubscribe();
}
```

## 🎨 Visual Design

- **React**: Yellow/gold theme with action buttons
- **Vue**: Green theme with read-only display
- **Angular**: Purple gradient card in dashboard

## 🔧 Extending This Pattern

Use the same approach for:
- Shopping cart sync (add/remove items in Vue → show count in React)
- User authentication (login in React → update all MFEs)
- Theme switching (dark mode toggle syncs everywhere)
- Notifications (toast in one MFE → banner in others)

## 📝 Interview Talking Points

1. **"We used RxJS BehaviorSubject for state management"**
   - Provides current value on subscribe (no race conditions)
   - Observable pattern fits Angular natively
   - React/Vue can subscribe via simple callbacks

2. **"Event bus complements state management"**
   - State for "what" (current value)
   - Events for "why" (who triggered it, when, context)

3. **"Proper cleanup prevents memory leaks"**
   - Every subscribe returns an unsubscribe function
   - React: cleanup in useEffect return
   - Vue: onUnmounted hook
   - Angular: ngOnDestroy lifecycle

4. **"Framework-agnostic shared library"**
   - TypeScript + RxJS works everywhere
   - No framework lock-in
   - Easy to test in isolation
