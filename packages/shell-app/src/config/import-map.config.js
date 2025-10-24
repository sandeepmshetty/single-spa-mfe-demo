/**
 * SystemJS Import Map Configuration
 * Configures module resolution for different environments (dev/prod)
 */

(function configureImportMap() {
  const isDevelopment =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const importMapScript = document.querySelector('script[type="systemjs-importmap"]');

  if (!importMapScript) {
    console.error('Import map script not found');
    return;
  }

  const importMap = JSON.parse(importMapScript.textContent);

  if (isDevelopment) {
    // Development URLs - local servers
    importMap.imports['@single-spa-demo/shared-library'] =
      'http://localhost:9000/shared-library.js';
    importMap.imports['@single-spa-demo/react-mfe'] = 'http://localhost:3001/react-mfe.js';
    importMap.imports['@single-spa-demo/vue-mfe'] = 'http://localhost:3002/vue-mfe.js';
    importMap.imports['@single-spa-demo/angular-mfe'] = 'http://localhost:3003/main.js';
  } else {
    // Production URLs - Vercel deployments
    importMap.imports['@single-spa-demo/shared-library'] =
      'https://shared-library.vercel.app/shared-library.js';
    importMap.imports['@single-spa-demo/react-mfe'] =
      'https://react-mfe-tau.vercel.app/react-mfe.js';
    importMap.imports['@single-spa-demo/vue-mfe'] = 'https://vue-mfe.vercel.app/vue-mfe.js';
    importMap.imports['@single-spa-demo/angular-mfe'] =
      'https://angular-mfe-indol.vercel.app/main.js';
  }

  importMapScript.textContent = JSON.stringify(importMap, null, 2);

  console.log(`🔧 Import map configured for: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
  console.log(
    '📦 Micro-frontends:',
    Object.keys(importMap.imports).filter(key => key.includes('@single-spa-demo'))
  );
})();
