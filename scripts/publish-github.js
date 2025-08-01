#!/usr/bin/env node

// Script to publish to GitHub Packages
// This ensures the package is correctly configured for GitHub Packages

import fs from 'fs';
import { execSync } from 'child_process';

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Create a backup
const originalPackageJson = { ...packageJson };

// Update package.json for GitHub Packages
packageJson.publishConfig = {
  registry: 'https://npm.pkg.github.com/',
  access: 'public'
};

// Write the modified package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

try {
  // Publish to GitHub Packages
  console.log('Publishing to GitHub Packages...');
  execSync('npm publish --ignore-scripts', { stdio: 'inherit' });
  console.log('Successfully published to GitHub Packages!');
} catch (error) {
  if (error.message.includes('version already exists')) {
    console.log('Version already exists on GitHub Packages, skipping...');
  } else {
    console.error('Failed to publish to GitHub Packages:', error.message);
    process.exit(1);
  }
} finally {
  // Restore the original package.json
  fs.writeFileSync('package.json', JSON.stringify(originalPackageJson, null, 2));
  console.log('Restored original package.json');
}