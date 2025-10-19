#!/usr/bin/env node

/**
 * Deploy all MFEs to Cloudflare Pages
 * Usage: node scripts/deploy-cloudflare.js [--production]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MFEs = [
  { name: 'shared-library', dir: 'packages/shared-library', project: 'mfe-shared' },
  { name: 'shell-app', dir: 'packages/shell-app', project: 'mfe-shell' },
  { name: 'react-mfe', dir: 'packages/react-mfe', project: 'mfe-react' },
  { name: 'vue-mfe', dir: 'packages/vue-mfe', project: 'mfe-vue' },
  { name: 'angular-mfe', dir: 'packages/angular-mfe', project: 'mfe-angular' },
];

const isProduction = process.argv.includes('--production') || process.argv.includes('-p');
const deploymentType = isProduction ? 'PRODUCTION' : 'PREVIEW';

console.log(`\n🚀 Starting Cloudflare Pages Deployment (${deploymentType})\n`);

function executeCommand(command, cwd) {
  try {
    console.log(`  📦 Running: ${command}`);
    execSync(command, {
      cwd: cwd || process.cwd(),
      stdio: 'inherit',
      shell: true,
    });
    return true;
  } catch (error) {
    console.error(`  ❌ Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function deployMFE(mfe, index) {
  console.log(`\n[${ index + 1}/${MFEs.length}] Deploying ${mfe.name}...`);
  console.log('━'.repeat(60));

  const mfePath = path.join(process.cwd(), mfe.dir);

  // Check if directory exists
  if (!fs.existsSync(mfePath)) {
    console.error(`  ❌ Directory not found: ${mfePath}`);
    return false;
  }

  // Build the MFE
  console.log(`\n  🔨 Building ${mfe.name}...`);
  if (!executeCommand('npm run build', mfePath)) {
    return false;
  }

  // Find the dist directory
  const distPath = path.join(mfePath, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error(`  ❌ Build output not found: ${distPath}`);
    return false;
  }

  // Deploy to Cloudflare Pages
  console.log(`\n  ☁️  Deploying to Cloudflare Pages...`);
  const deployCommand = isProduction
    ? `wrangler pages deploy dist --project-name=${mfe.project} --branch=main`
    : `wrangler pages deploy dist --project-name=${mfe.project} --branch=preview`;

  if (!executeCommand(deployCommand, mfePath)) {
    return false;
  }

  console.log(`\n  ✅ ${mfe.name} deployed successfully!`);
  return true;
}

async function main() {
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  // Check if Wrangler is installed
  try {
    execSync('wrangler --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Wrangler CLI not found. Please install it:');
    console.error('   npm install -g wrangler');
    console.error('   wrangler login');
    process.exit(1);
  }

  // Deploy each MFE
  for (let i = 0; i < MFEs.length; i++) {
    const success = deployMFE(MFEs[i], i);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Deployment Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Successful: ${successCount}/${MFEs.length}`);
  console.log(`❌ Failed: ${failCount}/${MFEs.length}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('═'.repeat(60));

  if (failCount > 0) {
    console.log('\n❌ Some deployments failed. Please check the logs above.');
    process.exit(1);
  } else {
    console.log('\n✅ All deployments successful!');
    console.log('\n🌐 Your MFEs are now live on Cloudflare Pages:');
    MFEs.forEach(mfe => {
      const url = isProduction
        ? `https://${mfe.project}.pages.dev`
        : `https://preview-${mfe.project}.pages.dev`;
      console.log(`   ${mfe.name}: ${url}`);
    });
  }
}

// Run
main().catch(error => {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
});
