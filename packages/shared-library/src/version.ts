export const VERSION = '1.0.0';

export interface IVersionInfo {
  version: string;
  compatible: (requiredVersion: string) => boolean;
}

export const versionInfo: IVersionInfo = {
  version: VERSION,
  compatible: (requiredVersion: string): boolean => {
    const [reqMajor, reqMinor] = requiredVersion.split('.').map(Number);
    const [curMajor, curMinor] = VERSION.split('.').map(Number);

    // Major version must match, minor version must be >= required
    return curMajor === reqMajor && curMinor >= reqMinor;
  },
};

// Expose version globally
if (globalThis.window !== undefined) {
  (globalThis.window as any).__SHARED_LIBRARY_VERSION__ = VERSION;
}
