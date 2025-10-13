# Technology Stack

## Programming Languages
- **TypeScript**: 5.2.2 (primary language across all packages)
- **JavaScript**: Node.js scripts and configuration files
- **PowerShell**: Automation scripts for Windows environment

## Frontend Frameworks

### React MFE
- **React**: 18.x
- **TypeScript**: 5.2.2
- **Single-SPA**: React integration

### Vue MFE
- **Vue**: 3.x
- **TypeScript**: 5.2.2
- **Single-SPA**: Vue integration

### Angular MFE
- **Angular**: 17.x
- **TypeScript**: 5.2.2
- **Single-SPA**: Angular integration

### Shell App
- **Single-SPA**: 5.x (root configuration)
- **SystemJS**: 6.x (module loading)
- **TypeScript**: 5.2.2

## Build Systems

### Webpack
- **Version**: 5.x
- **Used By**: shell-app, react-mfe, vue-mfe
- **Output Format**: SystemJS
- **Key Plugins**: 
  - webpack-dev-server for development
  - html-webpack-plugin for HTML generation
  - SystemJS webpack plugin for module format

### Angular CLI
- **Version**: 17.x
- **Used By**: angular-mfe
- **Custom Config**: webpack.config.js for Single-SPA integration
- **Builder**: @angular-devkit/build-angular

### Rollup
- **Version**: Latest
- **Used By**: shared-library
- **Purpose**: Library bundling and optimization
- **Output**: SystemJS-compatible module

## Testing Infrastructure

### Jest
- **Version**: Latest
- **Configuration**: Per-package + centralized integration tests
- **Coverage**: Enabled with coverage reports
- **Test Types**: Unit tests, integration tests, contract tests

### Testing Library
- **React Testing Library**: For React MFE
- **Vue Testing Library**: For Vue MFE
- **Angular Testing**: Built-in Angular testing utilities

## Code Quality Tools

### SonarQube
- **Version**: 25.10 (Community Edition)
- **Deployment**: Docker-based local instance
- **Port**: 9001
- **Configuration**: Custom rules via sonar-custom-rules.properties
- **Integration**: Per-package sonar-project.properties

### ESLint
- **Configuration**: .eslintrc.json at root
- **Scope**: All packages
- **Integration**: Workspace-level linting

### Prettier
- **Purpose**: Code formatting
- **Commands**: format:check, format:write
- **Scope**: All TypeScript, JavaScript, Vue files

## Package Management

### npm Workspaces
- **Version**: npm 9.0.0+
- **Workspaces**: packages/*
- **Benefits**: Shared dependencies, unified commands
- **Scripts**: Workspace-aware npm scripts

### Lerna
- **Version**: 7.4.2
- **Purpose**: Monorepo management utilities
- **Usage**: Optional tooling for advanced workflows

## Deployment Platform

### Vercel
- **CLI Version**: 32.4.1
- **Deployment**: Independent per micro-frontend
- **Configuration**: vercel.json per package
- **Environments**: Preview and Production

## Development Dependencies

### Core Tools
- `@types/node`: 20.8.7
- `@types/systemjs`: 6.15.3
- `concurrently`: 8.2.2 (parallel script execution)
- `rimraf`: 5.0.5 (cross-platform file deletion)
- `typescript`: 5.2.2

### Build Tools
- Webpack 5.x with loaders and plugins
- Babel for transpilation
- PostCSS for CSS processing

## Runtime Requirements

### Node.js
- **Minimum Version**: 18.0.0
- **Recommended**: Latest LTS

### npm
- **Minimum Version**: 9.0.0
- **Features Used**: Workspaces, workspace commands

### Docker
- **Purpose**: SonarQube local instance
- **Required For**: Code quality analysis
- **Compose Version**: docker-compose v2

## Development Commands

### Installation
```bash
npm install                    # Install root dependencies
npm run install:all           # Install all packages + tests
npm run install:packages      # Install only workspace packages
```

### Development
```bash
npm run dev                   # Start all MFEs concurrently
npm run dev:shell             # Start shell app only (port 9000)
npm run dev:react             # Start React MFE only (port 3001)
npm run dev:vue               # Start Vue MFE only (port 3002)
npm run dev:angular           # Start Angular MFE only (port 3003)
npm run dev:shared            # Start shared library only (port 3004)
```

### Building
```bash
npm run build                 # Build all packages
npm run build:shell           # Build shell app
npm run build:react           # Build React MFE
npm run build:vue             # Build Vue MFE
npm run build:angular         # Build Angular MFE
npm run build:shared          # Build shared library
```

### Testing
```bash
npm test                      # Run all tests (unit + integration)
npm run test:integration      # Run integration tests only
npm run test:integration:watch    # Watch mode for integration tests
npm run test:integration:coverage # Coverage for integration tests
npm run test:coverage         # Coverage for all packages
```

### Code Quality
```bash
npm run lint                  # Lint all packages
npm run lint:all              # Lint all packages (explicit)
npm run format:check          # Check code formatting
npm run format:write          # Fix code formatting
```

### SonarQube
```bash
npm run sonar:start           # Start SonarQube Docker container
npm run sonar:stop            # Stop SonarQube container
npm run sonar:scan            # Run SonarQube analysis
npm run sonar:wait            # Wait for SonarQube to be ready
npm run sonar:status          # Check SonarQube status
npm run sonar:rules           # Manage custom SonarQube rules
npm run sonar:logs            # View SonarQube logs
npm run sonar:clean           # Remove SonarQube volumes
```

### Deployment
```bash
npm run deploy:all            # Deploy all MFEs to production
npm run deploy:preview        # Deploy all MFEs to preview
npm run deploy:shell          # Deploy shell app only
npm run deploy:react          # Deploy React MFE only
npm run deploy:vue            # Deploy Vue MFE only
npm run deploy:angular        # Deploy Angular MFE only
npm run deploy:shared         # Deploy shared library only
```

### Preview
```bash
npm run preview:all           # Preview all MFEs on Vercel
npm run preview:shell         # Preview shell app
npm run preview:react         # Preview React MFE
npm run preview:vue           # Preview Vue MFE
npm run preview:angular       # Preview Angular MFE
npm run preview:shared        # Preview shared library
```

### Utilities
```bash
npm run clean                 # Clean all build artifacts and node_modules
```

## Environment Variables

### Development
- Automatic localhost detection in shell-app config.ts
- Default ports: 9000 (shell), 3001-3004 (MFEs)

### Production
- `REACT_MFE_URL`: React MFE production URL
- `VUE_MFE_URL`: Vue MFE production URL
- `ANGULAR_MFE_URL`: Angular MFE production URL
- `SHARED_LIB_URL`: Shared library production URL

## Browser Support
- Modern browsers with ES6+ support
- SystemJS for module loading
- No IE11 support (uses modern JavaScript features)
