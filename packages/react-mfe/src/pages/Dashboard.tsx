import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Card, LoadingSpinner, Alert } from '../components/common';
import useAuth from '../hooks/useAuth';
import { getCounterActions, getEventBus } from '../types/global';

const PageContainer = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.backgroundAlt};
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.xxl};
  color: ${theme.colors.white} !important;
`;

const Subtitle = styled.p`
  margin: ${theme.spacing.sm} 0 0 0;
  font-size: ${theme.fontSize.md};
  opacity: 0.9;
  color: ${theme.colors.white} !important;
`;

const UserInfo = styled.div`
  text-align: right;
  min-width: 200px;
`;

const UserEmail = styled.p`
  margin: 0 0 ${theme.spacing.xs} 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`;

const UserId = styled.p`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.fontSize.xs};
  opacity: 0.8;
`;

const CounterDisplay = styled.div`
  font-size: 48px;
  font-weight: ${theme.fontWeight.bold};
  text-align: center;
  margin: ${theme.spacing.xl} 0;
  color: ${theme.colors.primary};
`;

const LastSourceInfo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.primaryLight};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
  flex-wrap: wrap;
`;

const InfoRow = styled.p`
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [counter, setCounter] = useState(0);
  const [lastSource, setLastSource] = useState<string>('');

  useEffect(() => {
    const counterActions = getCounterActions();
    const eventBus = getEventBus();

    if (counterActions && eventBus) {
      setCounter(counterActions.getValue());

      const unsubscribe = counterActions.subscribe((value: number) => {
        setCounter(value);
      });

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
    const counterActions = getCounterActions();
    if (counterActions) {
      counterActions.increment('react-mfe');
    }
  };

  const handleDecrement = () => {
    const counterActions = getCounterActions();
    if (counterActions) {
      counterActions.decrement('react-mfe');
    }
  };

  const handleReset = () => {
    const counterActions = getCounterActions();
    if (counterActions) {
      counterActions.reset('react-mfe');
    }
  };

  const handleLogout = async () => {
    console.log(' Logging out...');
    const result = await logout();
    if (result.success) {
      console.log(' Logout successful, redirecting...');
      navigate('/login');
    } else {
      console.error(' Logout failed:', result.error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner fullScreen message="Loading dashboard..." />
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Card padding="xl">
          <Title>Not Authenticated</Title>
          <p>Please log in to access the dashboard.</p>
          <Button onClick={() => navigate('/login')} variant="primary">
            Go to Login
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <Title>React MFE - User Management</Title>
          <Subtitle>Single-SPA React Micro-Frontend</Subtitle>
        </HeaderContent>
        <UserInfo>
          <UserEmail>
            Welcome, <strong>{user?.email}</strong>
          </UserEmail>
          <UserId>User ID: {user?.id?.substring(0, 8)}...</UserId>
          <Button onClick={handleLogout} variant="error" size="sm">
             Logout
          </Button>
        </UserInfo>
      </Header>

      <Card padding="xl">
        <h2 style={{ marginTop: 0, color: theme.colors.primary }}> Shared Counter Demo</h2>
        <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
          This counter is shared across all micro-frontends using the shared state library.
        </p>

        <CounterDisplay>{counter}</CounterDisplay>

        {lastSource && (
          <LastSourceInfo>
            Last updated by: <strong>{lastSource}</strong>
          </LastSourceInfo>
        )}

        <ButtonGroup>
          <Button onClick={handleIncrement} variant="success" size="lg">
             Increment
          </Button>
          <Button onClick={handleDecrement} size="lg" style={{ backgroundColor: theme.colors.warning, borderColor: theme.colors.warning }}>
             Decrement
          </Button>
          <Button onClick={handleReset} variant="secondary" size="lg">
             Reset
          </Button>
        </ButtonGroup>
      </Card>

      <Card padding="lg" style={{ marginTop: theme.spacing.lg }}>
        <h3 style={{ marginTop: 0, color: theme.colors.primary }}> Session Information</h3>
        <InfoRow>
          <strong>Authentication Status:</strong>{' '}
          {isAuthenticated ? ' Authenticated' : ' Not Authenticated'}
        </InfoRow>
        <InfoRow>
          <strong>Email:</strong> {user?.email}
        </InfoRow>
        <InfoRow>
          <strong>User ID:</strong> {user?.id}
        </InfoRow>
        <InfoRow>
          <strong>Created:</strong>{' '}
          {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
        </InfoRow>
      </Card>

      <Alert variant="info" style={{ marginTop: theme.spacing.lg }}>
         <strong>Tip:</strong> Try refreshing the page (F5) - your session will persist! The
        AuthStateManager automatically restores your authentication state.
      </Alert>
    </PageContainer>
  );
};
