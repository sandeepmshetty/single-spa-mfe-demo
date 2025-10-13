// MFE Configuration - URLs for different environments
export const MFE_CONFIG = {
  development: {
    'react-mfe': 'http://localhost:3001/react-mfe.js',
    'vue-mfe': 'http://localhost:3002/vue-mfe.js',
    'angular-mfe': 'http://localhost:3003/main.js',
    'shared-library': 'http://localhost:9000/shared-library.js'
  },
  production: {
    'react-mfe': 'https://react-mfe-tau.vercel.app/react-mfe.js',
    'vue-mfe': 'https://vue-mfe.vercel.app/vue-mfe.js',
    'angular-mfe': 'https://angular-mfe-indol.vercel.app/main.js',
    'shared-library': 'https://shared-library.vercel.app/shared-library.js'
  }
};

export function getMFEConfig() {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDevelopment ? MFE_CONFIG.development : MFE_CONFIG.production;
}
