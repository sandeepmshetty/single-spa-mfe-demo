/**
 * Authentication UI Manager
 * Handles auth-related UI updates (avatar, dropdown, user info)
 */

import type { User, AuthState } from '@/types';

export class AuthUIManager {
  updateAuthState(authState: AuthState): void {
    const authStatus = document.getElementById('auth-status');
    const userAvatar = document.getElementById('user-avatar');
    const userMenuEmail = document.getElementById('user-menu-email');
    const userMenuId = document.getElementById('user-menu-id');

    if (!authStatus || !userAvatar) {
      return;
    }

    if (authState.isAuthenticated && authState.user) {
      this.updateAuthenticatedState(authStatus, userAvatar, authState.user);
      this.updateDropdownMenu(userMenuEmail, userMenuId, authState.user);
    } else {
      this.updateUnauthenticatedState(authStatus, userAvatar);
    }
  }

  private updateAuthenticatedState(
    authStatus: HTMLElement,
    userAvatar: HTMLElement,
    user: User
  ): void {
    const displayName = this.getDisplayName(user);
    const initials = this.getInitials(displayName);

    authStatus.textContent = displayName.split('@')[0];
    userAvatar.textContent = initials;
    userAvatar.style.background = 'rgba(16, 185, 129, 0.2)';
  }

  private updateUnauthenticatedState(authStatus: HTMLElement, userAvatar: HTMLElement): void {
    authStatus.textContent = 'Sign In';
    userAvatar.textContent = '👤';
    userAvatar.style.background = 'rgba(255, 255, 255, 0.2)';
  }

  private updateDropdownMenu(
    userMenuEmail: HTMLElement | null,
    userMenuId: HTMLElement | null,
    user: User
  ): void {
    if (userMenuEmail && user.email) {
      userMenuEmail.textContent = user.email;
    }
    if (userMenuId && user.id) {
      userMenuId.textContent = `ID: ${user.id.slice(0, 8)}...`;
    }
  }

  private getDisplayName(user: User): string {
    return user.user_metadata?.full_name || user.email || 'User';
  }

  private getInitials(displayName: string): string {
    if (displayName.includes('@')) {
      return displayName.charAt(0).toUpperCase();
    }
    return displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const authUIManager = new AuthUIManager();
