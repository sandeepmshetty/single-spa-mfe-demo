/**
 * SystemJS Import Map Configuration
 * Configures module resolution for different environments (dev/prod/docker)
 */

(function configureImportMap() {
  const hostname = window.location.hostname;
  const port = window.location.port;

  // Determine environment
  const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';

  // Docker detection: Check for a special env marker injected by webpack
  // In Docker, we set this via the HTML template
  const isDocker = !isProduction && window.__ENV__ && window.__ENV__.IS_DOCKER === 'true';

  const importMapScript = document.querySelector('script[type="systemjs-importmap"]');

  if (!importMapScript) {
    console.error('Import map script not found');
    return;
  }

  const importMap = JSON.parse(importMapScript.textContent);

  if (isProduction) {
    // Production URLs - Vercel deployments
    importMap.imports['@single-spa-demo/shared-library'] =
      'https://shared-library.vercel.app/shared-library.js';
    importMap.imports['@single-spa-demo/react-mfe'] =
      'https://react-mfe-tau.vercel.app/react-mfe.js';
    importMap.imports['@single-spa-demo/vue-mfe'] = 'https://vue-mfe.vercel.app/vue-mfe.js';
    importMap.imports['@single-spa-demo/angular-mfe'] =
      'https://angular-mfe-indol.vercel.app/main.js';
  } else if (isDocker) {
    // Docker URLs - containerized services
    importMap.imports['@single-spa-demo/shared-library'] =
      'http://localhost:9000/shared-library.js';
    importMap.imports['@single-spa-demo/react-mfe'] = 'http://localhost:8081/react-mfe.js';
    importMap.imports['@single-spa-demo/vue-mfe'] = 'http://localhost:8082/vue-mfe.js';
    importMap.imports['@single-spa-demo/angular-mfe'] = 'http://localhost:8083/main.js';
  } else {
    // Local development URLs - separate dev servers
    importMap.imports['@single-spa-demo/shared-library'] =
      'http://localhost:9000/shared-library.js';
    importMap.imports['@single-spa-demo/react-mfe'] = 'http://localhost:3001/react-mfe.js';
    importMap.imports['@single-spa-demo/vue-mfe'] = 'http://localhost:3002/vue-mfe.js';
    importMap.imports['@single-spa-demo/angular-mfe'] = 'http://localhost:3003/main.js';
  }

  importMapScript.textContent = JSON.stringify(importMap, null, 2);

  const environment = isProduction ? 'PRODUCTION' : isDocker ? 'DOCKER' : 'DEVELOPMENT';
  console.log(`🔧 Import map configured for: ${environment}`);
  console.log(
    '📦 Micro-frontends:',
    Object.keys(importMap.imports).filter(key => key.includes('@single-spa-demo'))
  );
})();
