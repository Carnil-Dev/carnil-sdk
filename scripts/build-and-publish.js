#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function buildPackage() {
  console.log('🔨 Building @carnil/sdk...');
  runCommand('pnpm build');
}

function publishPackage() {
  console.log('📦 Publishing @carnil/sdk...');

  // Check if package is already published
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );
    const packageName = packageJson.name;

    // Try to get package info from npm
    try {
      execSync(`npm view ${packageName} version`, { stdio: 'pipe' });
      console.log(`⚠️  Package ${packageName} already exists on npm. Skipping...`);
      return;
    } catch (error) {
      // Package doesn't exist, proceed with publishing
    }

    runCommand('npm publish --access public');
    console.log(`✅ Successfully published ${packageName}`);
  } catch (error) {
    console.error(`❌ Failed to publish @carnil/sdk:`, error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'build') {
    buildPackage();
  } else if (command === 'publish') {
    buildPackage();
    publishPackage();
  } else {
    console.log('Usage:');
    console.log('  node scripts/build-and-publish.js build');
    console.log('  node scripts/build-and-publish.js publish');
    console.log('\nRepository: https://github.com/Carnil-Dev/carnil-sdk');
  }
}

main();
