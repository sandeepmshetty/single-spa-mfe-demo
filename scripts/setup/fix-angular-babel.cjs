/**
 * Fix Angular Build Babel Runtime Issue
 * 
 * This script fixes a known issue where Angular's webpack build looks for
 * @babel/runtime in a nested path within @angular-devkit/build-angular.
 * 
 * The issue occurs because Angular's compiled modules reference a hardcoded
 * path that doesn't exist in the standard npm dependency tree.
 * 
 * This script runs automatically after npm install via the postinstall hook.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const sourcePath = path.join(rootDir, 'node_modules', '@babel');
const targetPath = path.join(rootDir, 'node_modules', '@angular-devkit', 'build-angular', 'node_modules');

function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Check if source exists
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Warning: Source directory not found: ${src}`);
    return false;
  }

  // Copy the directory
  try {
    // For cross-platform compatibility, we'll use a simple recursive copy
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    return true;
  } catch (error) {
    console.error(`❌ Error copying @babel/runtime: ${error.message}`);
    return false;
  }
}

function fixAngularBabel() {
  console.log('🔧 Fixing Angular Babel runtime resolution...');

  // Check if @angular-devkit/build-angular exists
  const buildAngularPath = path.join(rootDir, 'node_modules', '@angular-devkit', 'build-angular');
  if (!fs.existsSync(buildAngularPath)) {
    console.log('ℹ️  @angular-devkit/build-angular not found, skipping fix');
    return;
  }

  // Check if @babel/runtime exists
  if (!fs.existsSync(sourcePath)) {
    console.log('ℹ️  @babel/runtime not found, skipping fix');
    return;
  }

  // Copy @babel directory to the target location
  const targetBabelPath = path.join(targetPath, '@babel');
  const success = copyDirectory(sourcePath, targetBabelPath);

  if (success) {
    console.log('✅ Successfully fixed Angular Babel runtime resolution');
    console.log(`   Copied: ${sourcePath}`);
    console.log(`   To: ${targetBabelPath}`);
  } else {
    console.log('⚠️  Failed to fix Angular Babel runtime resolution');
  }
}

// Run the fix
fixAngularBabel();
