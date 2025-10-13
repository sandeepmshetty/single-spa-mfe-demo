# Project Structure

## Directory Organization

```
single-spa-mfe-demo/
├── packages/                    # Monorepo packages (npm workspaces)
│   ├── shell-app/              # Single-SPA root configuration
│   ├── react-mfe/              # React micro-frontend
│   ├── vue-mfe/                # Vue micro-frontend
│   ├── angular-mfe/            # Angular micro-frontend
│   └── shared-library/         # Shared utilities and components
├── tests/                      # Integration and contract tests
├── scripts/                    # Automation scripts (PowerShell, Node.js)
├── docs/                       # Project documentation
├── .github/workflows/          # CI/CD workflows
└── .amazonq/rules/             # Amazon Q custom rules and memory bank
```

## Core Components

### Shell App (packages/shell-app/)
- **Purpose**: Single-SPA root configuration and orchestrator
- **Port**: 9000
- **Key Files**:
  - `src/config.ts`: MFE URLs for development/production environments
  - `src/index.ejs`: HTML template with SystemJS import maps
  - `webpack.config.js`: Webpack configuration for SystemJS bundle
- **Responsibilities**: Route management, MFE registration, layout orchestration

### React MFE (packages/react-mfe/)
- **Purpose**: User management and authentication features
- **Port**: 3001
- **Framework**: React 18 with TypeScript
- **Build**: Webpack with SystemJS output
- **Key Features**: User authentication, profile management

### Vue MFE (packages/vue-mfe/)
- **Purpose**: Product catalog and shopping functionality
- **Port**: 3002
- **Framework**: Vue 3 with TypeScript
- **Build**: Webpack with SystemJS output
- **Key Features**: Product listings, shopping cart

### Angular MFE (packages/angular-mfe/)
- **Purpose**: Analytics dashboard and reporting
- **Port**: 3003
- **Framework**: Angular 17 with TypeScript
- **Build**: Angular CLI with custom webpack config
- **Key Features**: Data visualization, reporting dashboards

### Shared Library (packages/shared-library/)
- **Purpose**: Common utilities and cross-MFE communication
- **Port**: 3004
- **Build**: Rollup for library bundling
- **Exports**: Event bus, shared components, utility functions
- **Key Features**: Cross-MFE messaging, shared state management

## Architectural Patterns

### Micro-Frontend Architecture
- **Pattern**: Single-SPA orchestration with SystemJS module loading
- **Communication**: Event-driven architecture via shared-library event bus
- **Isolation**: Each MFE runs independently with own dependencies
- **Integration**: Runtime integration through SystemJS import maps

### Monorepo Structure
- **Tool**: npm workspaces
- **Benefits**: Shared dependencies, unified scripts, coordinated versioning
- **Workspace Packages**: 5 independent packages under `packages/`

### Build System
- **Shell/React/Vue**: Webpack 5 with SystemJS output format
- **Angular**: Angular CLI with custom webpack configuration
- **Shared Library**: Rollup for optimized library bundling
- **Output**: SystemJS-compatible bundles for runtime loading

### Testing Strategy
- **Unit Tests**: Per-package Jest configuration
- **Integration Tests**: Centralized in `tests/` directory
- **Contract Tests**: Verify MFE interface compatibility
- **Communication Tests**: Validate cross-MFE event messaging

### Deployment Architecture
- **Platform**: Vercel for all micro-frontends
- **Strategy**: Independent deployment per MFE
- **Configuration**: Environment-based URL resolution in shell-app
- **Automation**: PowerShell scripts for coordinated deployments

## Component Relationships

### Runtime Dependencies
```
Shell App (orchestrator)
  ├─> React MFE (loaded at /react)
  ├─> Vue MFE (loaded at /vue)
  ├─> Angular MFE (loaded at /angular)
  └─> Shared Library (loaded globally)
```

### Build-Time Dependencies
- All MFEs depend on Single-SPA framework
- All MFEs import types from shared-library
- Shell app configures import maps for all MFEs
- Integration tests depend on all packages

### Communication Flow
```
MFE A → Shared Library Event Bus → MFE B
  ↓                                   ↓
Shell App (routing coordination)
```

## Configuration Files

### Root Level
- `package.json`: Workspace configuration, unified scripts
- `sonar-project.properties`: SonarQube root configuration
- `docker-compose.sonar.yml`: Local SonarQube setup
- `.eslintrc.json`: Shared ESLint configuration

### Per-Package
- `package.json`: Package-specific dependencies and scripts
- `webpack.config.js` / `angular.json`: Build configuration
- `tsconfig.json`: TypeScript configuration
- `vercel.json`: Vercel deployment settings
- `sonar-project.properties`: Package-specific SonarQube config
