#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`[sessions-sdk-validate] ${message}`);
}

function error(message) {
  console.error(`[sessions-sdk-validate] ERROR: ${message}`);
}

function success(message) {
  console.log(`[sessions-sdk-validate] ✅ ${message}`);
}

function warning(message) {
  console.log(`[sessions-sdk-validate] ⚠️  ${message}`);
}

function isExpoProject() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return !!(
        packageJson.dependencies?.expo || packageJson.devDependencies?.expo
      );
    }
  } catch (err) {
    // Ignore errors in Expo detection
  }
  return false;
}

function isPackageInstalled(packageName) {
  try {
    // Try to resolve the package from the current working directory
    require.resolve(packageName, { paths: [process.cwd()] });
    return true;
  } catch (err) {
    // If require.resolve fails, check if the package exists in node_modules
    const nodeModulesPath = path.resolve(process.cwd(), 'node_modules', packageName);
    return fs.existsSync(nodeModulesPath);
  }
}

function extractPackageName(dep) {
  return dep.includes('@') && !dep.startsWith('@')
    ? dep.split('@')[0]
    : dep.startsWith('@')
      ? dep.split('@').slice(0, 2).join('@') // Handle scoped packages like @noble/hashes
      : dep;
}

function validateDependencies() {
  log('Validating @fogo/sessions-sdk-react-native dependencies...\n');

  // Core peer dependencies
  const peerDeps = [
    { name: '@metaplex-foundation/umi@>=1.4.0', description: 'Metaplex UMI framework for Solana interactions' },
    { name: '@noble/ciphers@>=1.0.0', description: 'Cryptographic ciphers' },
    { name: '@noble/curves@>=1.0.0', description: 'Elliptic curve cryptography' },
    { name: '@noble/hashes@>=1.0.0', description: 'Cryptographic hash functions' },
    { name: '@scure/base@>=1.0.0', description: 'Base encoding/decoding utilities' },
    { name: '@solana/webcrypto-ed25519-polyfill@>=3.0.0', description: 'Ed25519 cryptography polyfill' },
    { name: 'react@>=18.0.0', description: 'React framework' },
    { name: 'react-native@>=0.70.0', description: 'React Native framework' },
    { name: 'react-native-qrcode-svg@>=6.3.11', description: 'QR code generation component' },
    { name: 'react-native-svg@>=15.1.0', description: 'SVG support (required by QR code component)' },
    { name: 'react-native-safe-area-context@>=5.6.1', description: 'Safe area utilities' },
    { name: 'tweetnacl@>=1.0.3', description: 'Cryptographic library' }
  ];

  // Polyfill dependencies
  const polyfillDeps = [
    { name: 'react-native-get-random-values@^1.9.0', description: 'Secure random number generation' },
    { name: 'react-native-url-polyfill@^2.0.0', description: 'URL polyfill for React Native' },
    { name: 'buffer@^6.0.3', description: 'Node.js Buffer polyfill' },
    { name: 'process@^0.11.10', description: 'Node.js process polyfill' }
  ];

  let allDeps = [...peerDeps, ...polyfillDeps];

  // Add Expo-specific dependencies if detected
  if (isExpoProject()) {
    const expoDeps = [
      { name: 'expo-camera@>=16.0.0', description: 'Camera access for QR code scanning' },
      { name: 'expo-secure-store@>=14.2.3', description: 'Secure storage for session keys' },
      { name: 'expo-standard-web-crypto@>=2.1.4', description: 'Web Crypto API polyfill' },
      { name: 'readable-stream@^4.7.0', description: 'Stream polyfill for Expo' },
      { name: 'expo-crypto@^14.1.5', description: 'Additional crypto utilities' },
      { name: 'browserify-zlib@^0.2.0', description: 'Zlib polyfill for Expo' },
      { name: 'path-browserify@^1.0.1', description: 'Path polyfill for Expo' }
    ];
    allDeps = [...allDeps, ...expoDeps];
    log('📱 Expo project detected - including Expo-specific dependencies\n');
  }

  const results = {
    installed: [],
    missing: [],
    broken: []
  };

  // Check each dependency
  for (const dep of allDeps) {
    const packageName = extractPackageName(dep.name);

    if (isPackageInstalled(packageName)) {
      try {
        // Verify the package can actually be resolved
        require.resolve(packageName, { paths: [process.cwd()] });
        results.installed.push({ ...dep, packageName });
        console.log(`✅ ${packageName} - ${dep.description}`);
      } catch (err) {
        results.broken.push({ ...dep, packageName, error: err.message });
        console.log(`❌ ${packageName} - installed but broken: ${err.message}`);
      }
    } else {
      results.missing.push({ ...dep, packageName });
      console.log(`❌ ${packageName} - not installed (${dep.description})`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));

  if (results.missing.length === 0 && results.broken.length === 0) {
    success(`All ${results.installed.length} dependencies are properly installed and working!`);
    console.log('\n🎉 Your @fogo/sessions-sdk-react-native setup is ready to use!');
    return true;
  } else {
    error('Some dependencies are missing or broken:');

    if (results.missing.length > 0) {
      console.log(`\n📋 Missing dependencies (${results.missing.length}):`);
      results.missing.forEach(dep => {
        console.log(`   • ${dep.packageName}`);
      });
    }

    if (results.broken.length > 0) {
      console.log(`\n🔧 Broken dependencies (${results.broken.length}):`);
      results.broken.forEach(dep => {
        console.log(`   • ${dep.packageName} - ${dep.error}`);
      });
    }

    console.log('\n💡 To fix these issues, run the setup command:');
    console.log('   npx @fogo/sessions-sdk-react-native sessions-sdk-setup');

    console.log('\n📖 Or install manually:');
    if (isExpoProject()) {
      console.log('   expo install expo-camera expo-secure-store expo-standard-web-crypto expo-crypto');
      console.log('   pnpm add @metaplex-foundation/umi @noble/hashes @noble/curves @noble/ciphers');
      console.log('   pnpm add @scure/base @solana/webcrypto-ed25519-polyfill tweetnacl');
      console.log('   pnpm add react-native-qrcode-svg react-native-svg react-native-safe-area-context');
      console.log('   pnpm add react-native-get-random-values react-native-url-polyfill buffer process');
      console.log('   pnpm add readable-stream browserify-zlib path-browserify');
    } else {
      console.log('   pnpm add @metaplex-foundation/umi @noble/hashes @noble/curves @noble/ciphers');
      console.log('   pnpm add @scure/base @solana/webcrypto-ed25519-polyfill tweetnacl');
      console.log('   pnpm add react-native-qrcode-svg react-native-svg react-native-safe-area-context');
      console.log('   pnpm add react-native-get-random-values react-native-url-polyfill buffer process');
    }

    return false;
  }
}

function checkPolyfillSetup() {
  log('\nChecking polyfill setup...');

  const polyfillPath = path.resolve(process.cwd(), 'polyfills.js');

  if (fs.existsSync(polyfillPath)) {
    success('polyfills.js file found');

    // Check if polyfills.js is properly imported
    const commonEntryPoints = [
      'App.js', 'App.jsx', 'App.ts', 'App.tsx',
      'index.js', 'index.jsx', 'index.ts', 'index.tsx',
      'src/App.js', 'src/App.jsx', 'src/App.ts', 'src/App.tsx'
    ];

    let polyfillImported = false;
    for (const entryPoint of commonEntryPoints) {
      const entryPath = path.resolve(process.cwd(), entryPoint);
      if (fs.existsSync(entryPath)) {
        const content = fs.readFileSync(entryPath, 'utf8');
        if (content.includes('./polyfills') || content.includes('./polyfills.js')) {
          success(`polyfills.js is imported in ${entryPoint}`);
          polyfillImported = true;
          break;
        }
      }
    }

    if (!polyfillImported) {
      warning('polyfills.js exists but may not be imported in your app entry point');
      console.log('   Make sure to add this as the FIRST import in your App.js or index.js:');
      console.log('   import "./polyfills.js";');
    }
  } else {
    warning('polyfills.js file not found');
    console.log('   Run the setup command to create it:');
    console.log('   npx @fogo/sessions-sdk-react-native sessions-sdk-setup');
  }
}

function main() {
  console.log('🔍 @fogo/sessions-sdk-react-native Dependency Validator\n');

  const isValid = validateDependencies();
  checkPolyfillSetup();

  console.log('\n' + '='.repeat(60));

  if (isValid) {
    console.log('✅ VALIDATION PASSED - Setup is complete and ready to use!');
    process.exit(0);
  } else {
    console.log('❌ VALIDATION FAILED - Please fix the issues above');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateDependencies,
  checkPolyfillSetup,
  isExpoProject,
  isPackageInstalled
};