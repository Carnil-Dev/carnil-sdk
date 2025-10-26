#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = [
  'core',
  'stripe',
  'razorpay',
  'react',
  'next',
  'adapters',
  'analytics',
  'pricing-editor',
  'webhooks',
  'compliance',
  'globalization',
];

function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command} in ${cwd}`);
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      encoding: 'utf8',
    });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function buildAllPackages() {
  console.log('🔨 Building all packages...');
  runCommand('pnpm build');
}

function publishPackage(packageName) {
  const packagePath = path.join(__dirname, '..', 'packages', packageName);

  if (!fs.existsSync(packagePath)) {
    console.error(`Package ${packageName} not found at ${packagePath}`);
    return;
  }

  console.log(`📦 Publishing @carnil/${packageName}...`);

  // Check if package is already published
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
    const packageNameWithScope = `@carnil/${packageName}`;

    // Try to get package info from npm
    try {
      execSync(`npm view ${packageNameWithScope} version`, { stdio: 'pipe' });
      console.log(`⚠️  Package ${packageNameWithScope} already exists on npm. Skipping...`);
      return;
    } catch (error) {
      // Package doesn't exist, proceed with publishing
    }

    runCommand('npm publish --access public', packagePath);
    console.log(`✅ Successfully published @carnil/${packageName}`);
  } catch (error) {
    console.error(`❌ Failed to publish @carnil/${packageName}:`, error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'build') {
    buildAllPackages();
  } else if (command === 'publish') {
    const packageName = args[1];
    if (packageName) {
      if (packages.includes(packageName)) {
        buildAllPackages();
        publishPackage(packageName);
      } else {
        console.error(`Unknown package: ${packageName}`);
        console.error(`Available packages: ${packages.join(', ')}`);
        process.exit(1);
      }
    } else {
      console.log('📦 Publishing all packages...');
      buildAllPackages();
      packages.forEach(publishPackage);
    }
  } else if (command === 'publish-all') {
    console.log('📦 Publishing all packages...');
    buildAllPackages();
    packages.forEach(publishPackage);
  } else {
    console.log('Usage:');
    console.log('  node scripts/build-and-publish.js build');
    console.log('  node scripts/build-and-publish.js publish <package-name>');
    console.log('  node scripts/build-and-publish.js publish-all');
    console.log(`\nAvailable packages: ${packages.join(', ')}`);
    console.log('\nRepository: https://github.com/Carnil-Dev/carnil-sdk');
  }
}

main();
