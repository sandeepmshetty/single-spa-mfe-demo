// MFE Configuration - URLs for different environments
export const MFE_CONFIG = {
  development: {
    'react-mfe': 'http://localhost:3001/react-mfe.js',
    'vue-mfe': 'http://localhost:3002/vue-mfe.js',
    'angular-mfe': 'http://localhost:3003/main.js',
    'shared-library': 'http://localhost:9000/shared-library.js'
  },
  production: {
    // Update these URLs after deploying to Vercel
    'react-mfe': process.env.REACT_MFE_URL || 'https://react-mfe-xxx.vercel.app/react-mfe.js',
    'vue-mfe': process.env.VUE_MFE_URL || 'https://vue-mfe-xxx.vercel.app/vue-mfe.js',
    'angular-mfe': process.env.ANGULAR_MFE_URL || 'https://angular-mfe-xxx.vercel.app/main.js',
    'shared-library': process.env.SHARED_LIB_URL || 'https://shared-library-xxx.vercel.app/shared-library.js'
  }
};

export function getMFEConfig() {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDevelopment ? MFE_CONFIG.development : MFE_CONFIG.production;
}
