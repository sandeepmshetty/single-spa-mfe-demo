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

    targets.push(packageNodeModules, packageLock);
  }
}

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
  console.error('⚠️  Failed to clear npm cache:', error.message);
  process.exitCode = 1;
}

console.log('\n✅ Cleanup complete!');
