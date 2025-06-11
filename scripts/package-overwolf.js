const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Valorant Spike Timer for Overwolf...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
}

// Copy manifest.json to dist
console.log('📋 Copying manifest.json...');
fs.copyFileSync('public/manifest.json', 'dist/manifest.json');

// Create package info
const packageInfo = {
  name: 'valorant-spike-timer',
  version: '1.0.0',
  description: 'Valorant spike timer overlay using Overwolf SDK and React',
  main: 'index.html',
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