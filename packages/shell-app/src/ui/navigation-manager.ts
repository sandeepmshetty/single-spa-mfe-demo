/**
 * Navigation Manager
 * Handles navigation state and route-based UI updates
 */

export class NavigationManager {
  updateNavigationState(pathname: string): void {
    this.updateActiveNavItem(pathname);
    this.toggleWelcomeSection(pathname);
  }

  private updateActiveNavItem(pathname: string): void {
    const navItems = document.querySelectorAll('.nav-item');

    for (const item of navItems) {
      const element = item as HTMLElement;
      element.classList.remove('active');

      const route = element.dataset.route;
      if (this.isRouteActive(route, pathname)) {
        element.classList.add('active');
      }
    }
  }

  private isRouteActive(route: string | undefined, pathname: string): boolean {
    if (!route) {
      return false;
    }

    return (
      (route === 'home' && pathname === '/') ||
      (route === 'users' && pathname.startsWith('/users')) ||
      (route === 'products' && pathname.startsWith('/products')) ||
      (route === 'dashboard' && pathname.startsWith('/dashboard'))
    );
  }

  private toggleWelcomeSection(pathname: string): void {
    const welcomeElement = document.getElementById('welcome-section');
    const mfeContainer = document.getElementById('mfe-container');

    if (welcomeElement && mfeContainer) {
      if (pathname === '/') {
        welcomeElement.style.display = 'block';
        mfeContainer.style.display = 'none';
      } else {
        welcomeElement.style.display = 'none';
        mfeContainer.style.display = 'block';
      }
    }
  }
}

export const navigationManager = new NavigationManager();
