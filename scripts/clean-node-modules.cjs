const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const targets = [
  path.join(rootDir, 'node_modules'),
  path.join(rootDir, 'package-lock.json')
];

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
