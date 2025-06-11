const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Valorant Spike Timer for Overwolf...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.log('🔨 Building React app...');
  execSync('npm run react:build', { stdio: 'inherit' });
}

// Copy manifest.json to dist
console.log('📋 Copying manifest.json...');
fs.copyFileSync('public/manifest.json', 'dist/manifest.json');

// Copy main.js to dist
console.log('⚡ Copying main.js...');
fs.copyFileSync('public/main.js', 'dist/main.js');

// Create package info
const packageInfo = {
  name: 'valorant-spike-timer',
  version: '1.0.0',
  description: 'Valorant spike timer overlay using ow-electron and React',
  main: 'main.js',
  overwolf: {
    manifest: 'manifest.json'
  }
};

fs.writeFileSync('dist/package.json', JSON.stringify(packageInfo, null, 2));

console.log('✅ Overwolf package ready in dist/ directory');
console.log('📝 Next steps:');
console.log('   1. Zip the dist/ directory');
console.log('   2. Upload to Overwolf Developer Console');
console.log('   3. Test with Overwolf client');
console.log('   4. Submit for review');