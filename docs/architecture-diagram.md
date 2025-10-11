# Single-SPA Micro-Frontend Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 USER BROWSER                                │
│                            (shell.your-domain.com)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SINGLE-SPA ROOT CONFIG                          │
│                               (Shell Application)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Navigation    │  │   Authentication │  │     Global Error Handler    │ │
│  │   Coordinator   │  │     Manager      │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    APPLICATION REGISTRY                            │   │
│  │  registerApplication('/users/*', ReactMFE)                         │   │
│  │  registerApplication('/products/*', VueMFE)                        │   │
│  │  registerApplication('/dashboard/*', AngularMFE)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                        Route-based Application Loading
                                        ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐
│   REACT MFE     │  │    VUE MFE      │  │  ANGULAR MFE    │  │ SHARED LIB   │
│                 │  │                 │  │                 │  │              │
│ react-mfe.      │  │ vue-mfe.        │  │ angular-mfe.    │  │ shared.      │
│ your-domain.com │  │ your-domain.com │  │ your-domain.com │  │ your-domain. │
│                 │  │                 │  │                 │  │ com          │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └──────────────┘
```

## Local Development Ports

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT ENVIRONMENT                             │
│                  C:\Users\sande\Repo\Micro-Frontend\                       │
│                     Micro-Frontend-Single-SPA\                             │
└─────────────────────────────────────────────────────────────────────────────┘

Local Development:
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Shell App        │    │ React MFE        │    │ Vue MFE          │
│ localhost:9000   │    │ localhost:3001   │    │ localhost:3002   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                 │
                    ┌──────────────────┐    ┌──────────────────┐
                    │ Angular MFE      │    │ Shared Library   │
                    │ localhost:3003   │    │ localhost:3004   │
                    └──────────────────┘    └──────────────────┘
```

## Detailed Component Architecture

```
┌────────────────────────────────────────────────────────────────────━━━━━━━━━┐
│                              SHELL APPLICATION                      ━━━━━━━━━│
│ ┌─────────────────────────────────────────────────────────────────┐ ━━━━━━━━━│
│ │                        ROOT CONFIG                              │ ━━━━━━━━━│
│ │                                                                 │ ━━━━━━━━━│
│ │  import { registerApplication, start } from 'single-spa';       │ ━━━━━━━━━│
│ │                                                                 │ ━━━━━━━━━│
│ │  registerApplication({                                          │ ━━━━━━━━━│
│ │    name: 'react-users',                                         │ ━━━━━━━━━│
│ │    app: () => System.import('react-mfe'),                       │ ━━━━━━━━━│
│ │    activeWhen: location => location.pathname.startsWith('/users')│ ━━━━━━━━━│
│ │  });                                                            │ ━━━━━━━━━│
│ └─────────────────────────────────────────────────────────────────┘ ━━━━━━━━━│
│                                                                     ━━━━━━━━━│
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐ ━━━━━━━━━│
│ │   Global Nav    │ │  Auth Provider  │ │    Event Bus            │ ━━━━━━━━━│
│ │                 │ │                 │ │                         │ ━━━━━━━━━│
│ │ • Home          │ │ • Login State   │ │ • App-to-App Comm       │ ━━━━━━━━━│
│ │ • Users         │ │ • Token Mgmt    │ │ • State Sync            │ ━━━━━━━━━│
│ │ • Products      │ │ • User Info     │ │ • Custom Events         │ ━━━━━━━━━│
│ │ • Dashboard     │ │ • Permissions   │ │ • Message Passing       │ ━━━━━━━━━│
│ └─────────────────┘ └─────────────────┘ └─────────────────────────┘ ━━━━━━━━━│
└─────────────────────────────────────────────────────────────────────━━━━━━━━━┘
                                    │
                        ┌───────────┼───────────┐
                        ▼           ▼           ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   REACT MFE     │ │    VUE MFE      │ │  ANGULAR MFE    │
│  (User Mgmt)    │ │  (Products)     │ │  (Dashboard)    │
│                 │ │                 │ │                 │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │   Routes    │ │ │ │   Routes    │ │ │ │   Routes    │ │
│ │ /users      │ │ │ │ /products   │ │ │ │ /dashboard  │ │
│ │ /users/:id  │ │ │ │ /products/:id│ │ │ │ /analytics  │ │
│ │ /profile    │ │ │ │ /cart       │ │ │ │ /reports    │ │
│ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
│                 │ │                 │ │                 │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │ Components  │ │ │ │ Components  │ │ │ │ Components  │ │
│ │ • UserList  │ │ │ │ • ProductCard│ │ │ │ • Chart     │ │
│ │ • UserForm  │ │ │ │ • SearchBar │ │ │ │ • DataTable │ │
│ │ • Profile   │ │ │ │ • Cart      │ │ │ │ • KPIWidget │ │
│ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
│                 │ │                 │ │                 │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │ State Mgmt  │ │ │ │ State Mgmt  │ │ │ │ State Mgmt  │ │
│ │ Redux/Zustand│ │ │ │ Vuex/Pinia  │ │ │ │ NgRx        │ │
│ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
│                 │ │                 │ │                 │
│ Lifecycle:      │ │ Lifecycle:      │ │ Lifecycle:      │ │
│ • bootstrap()   │ │ • bootstrap()   │ │ • bootstrap()   │ │
│ • mount()       │ │ • mount()       │ │ • mount()       │ │
│ • unmount()     │ │ • unmount()     │ │ • unmount()     │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Technology Stack per Component

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TECHNOLOGY STACK                                │
└─────────────────────────────────────────────────────────────────────────────┘

Shell Application:
├── Single-SPA (Root Config)
├── SystemJS (Module Loading)
├── Import Maps
├── Webpack 5
├── HTML/CSS/Vanilla JS
└── Custom Event Bus

React MFE:
├── React 18
├── React Router DOM
├── Redux Toolkit / Zustand
├── Styled Components / Tailwind
├── React Query / SWR
├── Webpack 5 + Module Federation
└── Single-SPA React Helpers

Vue MFE:
├── Vue 3 (Composition API)
├── Vue Router 4
├── Pinia (State Management)
├── Vite Build Tool
├── Vue 3 Single-SPA Helpers
├── Tailwind CSS
└── Axios

Angular MFE:
├── Angular 17
├── Angular Router
├── NgRx (State Management)
├── Angular Material UI
├── RxJS
├── Angular CLI + Webpack
└── Single-SPA Angular Helpers

Shared Library:
├── TypeScript
├── Rollup (Build Tool)
├── Common UI Components
├── Utility Functions
├── Type Definitions
└── CSS Design Tokens
```