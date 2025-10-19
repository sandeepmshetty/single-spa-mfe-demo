#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all premium free tier services are configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Premium Free Tier Setup Verification\n');
console.log('='.repeat(60));

let allGood = true;
const issues = [];
const warnings = [];

// Check 1: Environment file exists
console.log('\n📝 Checking environment configuration...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env.local file found');
  
  // Read and parse env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
    'NEXT_PUBLIC_SENTRY_DSN': 'Sentry DSN',
    'NEXT_PUBLIC_POSTHOG_KEY': 'PostHog API Key',
  };

  const optionalVars = {
    'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
    'SENTRY_AUTH_TOKEN': 'Sentry Auth Token',
    'GRAFANA_CLOUD_API_KEY': 'Grafana API Key',
    'RESEND_API_KEY': 'Resend API Key',
    'CLOUDFLARE_API_TOKEN': 'Cloudflare API Token',
  };

  // Check required variables
  console.log('\n  Required variables:');
  for (const [varName, description] of Object.entries(requiredVars)) {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() && !match[1].includes('xxxxx')) {
      console.log(`    ✅ ${description}`);
    } else {
      console.log(`    ❌ ${description} - Missing or not configured`);
      issues.push(`${description} is not configured in .env.local`);
      allGood = false;
    }
  }

  // Check optional variables
  console.log('\n  Optional variables:');
  for (const [varName, description] of Object.entries(optionalVars)) {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() && !match[1].includes('xxxxx')) {
      console.log(`    ✅ ${description}`);
    } else {
      console.log(`    ⚠️  ${description} - Not configured (optional)`);
      warnings.push(`${description} is not configured (you can add it later)`);
    }
  }

} else {
  console.log('  ❌ .env.local file not found');
  console.log('     Create it by copying .env.example:');
  console.log('     Copy-Item .env.example .env.local');
  issues.push('.env.local file does not exist');
  allGood = false;
}

// Check 2: Required packages installed
console.log('\n📦 Checking installed packages...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const requiredPackages = {
  '@supabase/supabase-js': 'Supabase client',
  '@sentry/browser': 'Sentry error tracking',
  '@sentry/tracing': 'Sentry performance',
  'posthog-js': 'PostHog analytics',
  'resend': 'Resend email',
};

for (const [pkg, description] of Object.entries(requiredPackages)) {
  if (packageJson.dependencies && packageJson.dependencies[pkg]) {
    console.log(`  ✅ ${description} (${pkg})`);
  } else {
    console.log(`  ❌ ${description} (${pkg}) - Not installed`);
    issues.push(`${pkg} is not installed`);
    allGood = false;
  }
}

// Check 3: Node modules exist
console.log('\n📁 Checking node_modules...');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✅ node_modules directory exists');
  
  // Check if premium packages are actually installed
  const supabasePath = path.join(nodeModulesPath, '@supabase', 'supabase-js');
  const sentryPath = path.join(nodeModulesPath, '@sentry', 'browser');
  const posthogPath = path.join(nodeModulesPath, 'posthog-js');
  
  if (fs.existsSync(supabasePath)) {
    console.log('  ✅ Supabase package installed');
  } else {
    console.log('  ⚠️  Supabase package not found in node_modules');
    warnings.push('Run: npm install @supabase/supabase-js');
  }
  
  if (fs.existsSync(sentryPath)) {
    console.log('  ✅ Sentry package installed');
  } else {
    console.log('  ⚠️  Sentry package not found in node_modules');
    warnings.push('Run: npm install @sentry/browser @sentry/tracing');
  }
  
  if (fs.existsSync(posthogPath)) {
    console.log('  ✅ PostHog package installed');
  } else {
    console.log('  ⚠️  PostHog package not found in node_modules');
    warnings.push('Run: npm install posthog-js');
  }
} else {
  console.log('  ❌ node_modules directory not found');
  console.log('     Run: npm install');
  issues.push('Dependencies not installed');
  allGood = false;
}

// Check 4: Integration files
console.log('\n🔧 Checking integration files...');
const integrationFiles = [
  'packages/shared-library/src/config/supabase.ts',
  'packages/shared-library/src/monitoring/sentry.ts',
  'packages/shared-library/src/analytics/posthog.ts',
];

let integrationFilesExist = 0;
for (const file of integrationFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
    integrationFilesExist++;
  } else {
    console.log(`  ⚠️  ${file} - Not created yet`);
  }
}

if (integrationFilesExist === 0) {
  warnings.push('Integration files not created yet (I can create them for you)');
} else if (integrationFilesExist < integrationFiles.length) {
  warnings.push('Some integration files are missing');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY\n');

if (allGood && issues.length === 0) {
  console.log('✅ All critical checks passed!');
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  if (integrationFilesExist === 0) {
    console.log('\n📝 Next Steps:');
    console.log('   1. Tell me you\'re ready');
    console.log('   2. I\'ll create the integration files');
    console.log('   3. Build shared library: cd packages/shared-library && npm run build');
    console.log('   4. Start dev servers: npm run dev');
    console.log('   5. Test in browser console');
  } else {
    console.log('\n🚀 Ready to go!');
    console.log('   Run: npm run dev');
    console.log('   Open: http://localhost:9000');
  }
} else {
  console.log('❌ Issues found:\n');
  issues.forEach(i => console.log(`   - ${i}`));
  
  console.log('\n🔧 How to fix:');
  console.log('   1. Make sure you\'ve run: npm install');
  console.log('   2. Create .env.local from .env.example');
  console.log('   3. Fill in your credentials from each service');
  console.log('   4. Run this script again: node scripts/verify-setup.js');
}

console.log('\n' + '='.repeat(60));
console.log('\n💬 Need help? Check YOUR_NEXT_STEPS.md\n');

// Exit with error code if issues found
process.exit(allGood ? 0 : 1);
