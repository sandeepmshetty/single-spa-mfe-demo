import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

type AuthView = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const [activeView, setActiveView] = useState<AuthView>('login');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redirect to dashboard (React MFE root)
    navigate('/');
  };

  const handleRegisterSuccess = () => {
    // Switch to login view after successful registration
    setActiveView('login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #f0f0f0',
          }}
        >
          <button
            onClick={() => setActiveView('login')}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: activeView === 'login' ? 'white' : '#fafafa',
              color: activeView === 'login' ? '#007bff' : '#666',
              border: 'none',
              borderBottom: activeView === 'login' ? '2px solid #007bff' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveView('register')}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: activeView === 'register' ? 'white' : '#fafafa',
              color: activeView === 'register' ? '#28a745' : '#666',
              border: 'none',
              borderBottom:
                activeView === 'register' ? '2px solid #28a745' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {activeView === 'login' ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setActiveView('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setActiveView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
