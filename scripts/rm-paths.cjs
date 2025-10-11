const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('⚠️  No paths provided to rm-paths.');
  process.exit(1);
}

const cwd = process.cwd();

const formatTarget = (input, resolved) => {
  const relativeToCwd = path.relative(cwd, resolved) || '.';
  return `${input} (${relativeToCwd})`;
};

for (const input of args) {
  const target = path.resolve(cwd, input);

  if (!fs.existsSync(target)) {
    console.log(`ℹ️  Skipping ${formatTarget(input, target)} (not found)`);
    continue;
  }

  console.log(`🧹 Removing ${formatTarget(input, target)}`);
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch (err) {
    console.error(`⚠️  Failed to remove ${formatTarget(input, target)}:`, err);
    process.exitCode = 1;
  }
}
