const fs = require('fs');
const path = require('path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '../..');
const packagesDir = path.join(rootDir, 'packages');

const targets = [
  path.join(rootDir, 'node_modules'),
  path.join(rootDir, 'package-lock.json')
];

// Add tests directory
const testsDir = path.join(rootDir, 'tests');
if (fs.existsSync(testsDir)) {
  targets.push(
    path.join(testsDir, 'node_modules'),
    path.join(testsDir, 'package-lock.json')
  );
}

if (fs.existsSync(packagesDir)) {
  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageRoot = path.join(packagesDir, entry.name);
    const packageNodeModules = path.join(packageRoot, 'node_modules');
    const packageLock = path.join(packageRoot, 'package-lock.json');
    
    // Add build cache folders
    const angularCache = path.join(packageRoot, '.angular');
    const nextCache = path.join(packageRoot, '.next');
    const turboCache = path.join(packageRoot, '.turbo');
    const viteCache = path.join(packageRoot, '.vite');

    targets.push(packageNodeModules, packageLock, angularCache, nextCache, turboCache, viteCache);
  }
}

// Add root-level cache folders
targets.push(
  path.join(rootDir, '.angular'),
  path.join(rootDir, '.next'),
  path.join(rootDir, '.turbo'),
  path.join(rootDir, '.vite'),
  path.join(rootDir, 'node_modules', '@angular-devkit', 'build-angular', 'node_modules')
);

const formatTarget = (dir) => path.relative(rootDir, dir) || '.';

for (const target of targets) {
  if (!fs.existsSync(target)) {
    console.log(`ℹ️  Skipping ${formatTarget(target)} (not found)`);
    continue;
  }

  console.log(`🧹 Removing ${formatTarget(target)}`);
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch (err) {
    console.error(`⚠️  Failed to remove ${formatTarget(target)}:`, err);
    process.exitCode = 1;
  }
}

// Clear npm cache with force
console.log('\n🧹 Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✓ npm cache cleared successfully');
} catch (error) {
  console.warn('⚠️  Warning: Failed to clear npm cache. This is common on Windows and usually harmless.');
  console.warn('   You can try running "npm cache verify" manually if you experience installation issues.');
  // Do not set exitCode to 1 for cache clean failure as it's not critical for project cleanup
}

console.log('\n✅ Cleanup complete!');
