import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [counter, setCounter] = useState(0);
  const [lastSource, setLastSource] = useState<string>('');

  useEffect(() => {
    // Access shared services from globalThis
    const sharedServices = (globalThis as any).sharedServices;
    const counterActions = sharedServices?.counterActions;
    const eventBus = sharedServices?.eventBus;

    if (counterActions && eventBus) {
      // Initialize with current value
      setCounter(counterActions.getValue());

      // Subscribe to counter changes
      const unsubscribe = counterActions.subscribe((value: number) => {
        setCounter(value);
      });

      // Listen to event bus for source tracking
      const unsubscribeEvents = eventBus.onAll((payload: any) => {
        if (payload.type.startsWith('counter-')) {
          setLastSource(payload.source);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeEvents();
      };
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
    console.log('🔓 Logging out...');
    const result = await logout();
    if (result.success) {
      console.log('✅ Logout successful, redirecting...');
      navigate('/login');
    } else {
      console.error('❌ Logout failed:', result.error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h2>Not authenticated</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

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
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            Welcome, <strong>{user?.email}</strong>
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', opacity: 0.9 }}>
            User ID: {user?.id?.substring(0, 8)}...
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
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔓 Logout
          </button>
        </div>
      </header>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0, color: '#007bff' }}>
          🎯 Shared Counter Demo
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This counter is shared across all micro-frontends using the shared state library.
        </p>

        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '30px 0',
          color: '#007bff'
        }}>
          {counter}
        </div>

        {lastSource && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#004085'
          }}>
            Last updated by: <strong>{lastSource}</strong>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleIncrement}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            ➕ Increment
          </button>

          <button
            onClick={handleDecrement}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#ffc107',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            ➖ Decrement
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>
          📊 Session Information
        </h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffc107'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
          💡 <strong>Tip:</strong> Try refreshing the page (F5) - your session will persist!
          The AuthStateManager automatically restores your authentication state.
        </p>
      </div>
    </div>
  );
};
