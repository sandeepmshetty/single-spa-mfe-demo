export const VERSION = '1.0.0';

export interface VersionInfo {
  version: string;
  compatible: (requiredVersion: string) => boolean;
}

export const versionInfo: VersionInfo = {
  version: VERSION,
  compatible: (requiredVersion: string): boolean => {
    const [reqMajor, reqMinor] = requiredVersion.split('.').map(Number);
    const [curMajor, curMinor] = VERSION.split('.').map(Number);
    
    // Major version must match, minor version must be >= required
    return curMajor === reqMajor && curMinor >= reqMinor;
  }
};

// Expose version globally
if (typeof window !== 'undefined') {
  (window as any).__SHARED_LIBRARY_VERSION__ = VERSION;
}
