import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';

const UsersDashboard: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [lastSource, setLastSource] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Access shared services from globalThis (provided by shell)
    const sharedServices = (globalThis as any).sharedServices;
    const counterActions = sharedServices?.counterActions;
    const eventBus = sharedServices?.eventBus;

    if (counterActions && eventBus) {
      // Initialize with current value
      setCounter(counterActions.getValue());

      // Subscribe to counter changes from any MFE
      const unsubscribe = counterActions.subscribe((value: number) => {
        setCounter(value);
      });

      // Also listen to event bus for source tracking
      const unsubscribeEvents = eventBus.onAll((payload: any) => {
        if (payload.type.startsWith('counter-')) {
          setLastSource(payload.source);
        }
        // Listen for auth events
        if (payload.type === 'auth:login' || payload.type === 'auth:register') {
          setUser(payload.payload?.user);
        }
      });

      // Get current user if authenticated
      sharedServices.supabaseAuthService?.getCurrentUser().then((result: any) => {
        if (result.user) {
          setUser(result.user);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeEvents();
      };
    } else {
      console.warn('⚠️ React MFE: Shared services not available');
    }
  }, []);

  const handleIncrement = () => {
    const counterActions = (globalThis as any).sharedServices?.counterActions;
    if (counterActions) {
      counterActions.increment('react-mfe');
    }
  };

  const handleDecrement = () => {
    const counterActions = (globalThis as any).sharedServices?.counterActions;
    if (counterActions) {
      counterActions.decrement('react-mfe');
    }
  };

  const handleReset = () => {
    const counterActions = (globalThis as any).sharedServices?.counterActions;
    if (counterActions) {
      counterActions.reset('react-mfe');
    }
  };

  const handleLogout = async () => {
    const sharedServices = (globalThis as any).sharedServices;
    const result = await sharedServices.supabaseAuthService?.signOut();
    
    if (!result?.error) {
      // EventBus.emit takes (type, data, source) not an object
      sharedServices.eventBus?.emit('auth:logout', {}, 'react-mfe');
      setUser(null);
      globalThis.location.href = '/login';
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <header style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>React MFE - User Management</h1>
          <p style={{ margin: '10px 0 0 0' }}>Single-SPA React Micro-Frontend</p>
        </div>
        {user && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              Welcome, <strong>{user.email}</strong>
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>
      
      <main>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>User Management Dashboard</h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            This is the React micro-frontend responsible for user authentication, 
            user profiles, and session management within the Single-SPA ecosystem.
          </p>
          {user && (
            <div style={{ 
              marginTop: '15px', 
              padding: '12px', 
              backgroundColor: '#d4edda', 
              color: '#155724',
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
              ✅ You are authenticated and can access protected features!
            </div>
          )}
        </div>

        {/* Cross-MFE Communication Demo */}
        <div style={{ 
          backgroundColor: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #ffc107'
        }}>
          <h3 style={{ color: '#856404', marginTop: 0 }}>
            🔗 Cross-MFE Counter Demo
          </h3>
          <p style={{ color: '#856404', fontSize: '14px' }}>
            Actions here update counters in Vue & Angular MFEs in real-time!
          </p>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            marginTop: '20px'
          }}>
            <button
              onClick={handleDecrement}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              -
            </button>
            
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#007bff',
              minWidth: '80px',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '5px',
              border: '2px solid #007bff'
            }}>
              {counter}
            </div>
            
            <button
              onClick={handleIncrement}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              +
            </button>
            
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>

          {lastSource && (
            <p style={{ 
              marginTop: '15px', 
              fontSize: '12px', 
              color: '#856404',
              fontStyle: 'italic'
            }}>
              Last updated by: <strong>{lastSource}</strong>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename="/users">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
