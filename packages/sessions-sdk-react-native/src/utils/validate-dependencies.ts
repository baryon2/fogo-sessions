/**
 * Runtime dependency validation for @fogo/sessions-sdk-react-native
 *
 * This utility helps developers verify that all required dependencies
 * are properly installed and configured at runtime.
 */

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  broken: string[];
  warnings: string[];
}

interface DependencyInfo {
  name: string;
  required: boolean;
  description: string;
  installCommand?: string;
}

const REQUIRED_DEPENDENCIES: DependencyInfo[] = [
  {
    name: '@metaplex-foundation/umi',
    required: true,
    description: 'Metaplex UMI framework for Solana interactions',
    installCommand: 'pnpm add @metaplex-foundation/umi@^1.4.0'
  },
  {
    name: '@noble/hashes',
    required: true,
    description: 'Cryptographic hash functions',
    installCommand: 'pnpm add @noble/hashes@^1.0.0'
  },
  {
    name: '@noble/curves',
    required: true,
    description: 'Elliptic curve cryptography',
    installCommand: 'pnpm add @noble/curves@^1.0.0'
  },
  {
    name: '@noble/ciphers',
    required: true,
    description: 'Cryptographic ciphers',
    installCommand: 'pnpm add @noble/ciphers@^1.0.0'
  },
  {
    name: '@scure/base',
    required: true,
    description: 'Base encoding/decoding utilities',
    installCommand: 'pnpm add @scure/base@^1.0.0'
  },
  {
    name: '@solana/webcrypto-ed25519-polyfill',
    required: true,
    description: 'Ed25519 cryptography polyfill for React Native',
    installCommand: 'pnpm add @solana/webcrypto-ed25519-polyfill@^3.0.0'
  },
  {
    name: 'react-native-get-random-values',
    required: true,
    description: 'Secure random number generation for React Native',
    installCommand: 'pnpm add react-native-get-random-values@^1.9.0'
  },
  {
    name: 'buffer',
    required: true,
    description: 'Node.js Buffer polyfill for React Native',
    installCommand: 'pnpm add buffer@^6.0.3'
  },
  {
    name: 'tweetnacl',
    required: true,
    description: 'Cryptographic library for signing and encryption',
    installCommand: 'pnpm add tweetnacl@^1.0.3'
  }
];

const EXPO_DEPENDENCIES: DependencyInfo[] = [
  {
    name: 'expo-camera',
    required: true,
    description: 'Camera access for QR code scanning',
    installCommand: 'expo install expo-camera'
  },
  {
    name: 'expo-secure-store',
    required: true,
    description: 'Secure storage for session keys',
    installCommand: 'expo install expo-secure-store'
  },
  {
    name: 'expo-standard-web-crypto',
    required: true,
    description: 'Web Crypto API polyfill for Expo',
    installCommand: 'expo install expo-standard-web-crypto'
  },
  {
    name: 'expo-crypto',
    required: false,
    description: 'Additional crypto utilities for Expo',
    installCommand: 'expo install expo-crypto'
  }
];

const UI_DEPENDENCIES: DependencyInfo[] = [
  {
    name: 'react-native-qrcode-svg',
    required: true,
    description: 'QR code generation component',
    installCommand: 'pnpm add react-native-qrcode-svg@^6.3.11'
  },
  {
    name: 'react-native-svg',
    required: true,
    description: 'SVG support for React Native (required by QR code component)',
    installCommand: 'pnpm add react-native-svg@^15.1.0'
  },
  {
    name: 'react-native-safe-area-context',
    required: true,
    description: 'Safe area utilities for proper UI layout',
    installCommand: 'pnpm add react-native-safe-area-context@^5.6.1'
  }
];

function tryRequire(moduleName: string): boolean {
  try {
    // In React Native, we use require to check if module is available
    require.resolve(moduleName);
    return true;
  } catch (error) {
    return false;
  }
}

function isExpoProject(): boolean {
  try {
    require.resolve('expo');
    return true;
  } catch {
    return false;
  }
}

export function validateDependencies(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    missing: [],
    broken: [],
    warnings: []
  };

  const allDependencies = [...REQUIRED_DEPENDENCIES, ...UI_DEPENDENCIES];

  // Add Expo dependencies if in Expo project
  if (isExpoProject()) {
    allDependencies.push(...EXPO_DEPENDENCIES);
  }

  for (const dep of allDependencies) {
    const isInstalled = tryRequire(dep.name);

    if (!isInstalled) {
      if (dep.required) {
        result.missing.push(dep.name);
        result.isValid = false;
      } else {
        result.warnings.push(`Optional dependency ${dep.name} is not installed`);
      }
    }
  }

  return result;
}

export function validateDependenciesWithReport(): ValidationResult {
  console.log('🔍 Validating @fogo/sessions-sdk-react-native dependencies...\n');

  const result = validateDependencies();

  if (result.isValid && result.missing.length === 0) {
    console.log('✅ All required dependencies are properly installed!\n');
  } else {
    console.log('❌ Dependency validation failed:\n');

    if (result.missing.length > 0) {
      console.log('Missing required dependencies:');
      result.missing.forEach(dep => {
        const info = [...REQUIRED_DEPENDENCIES, ...UI_DEPENDENCIES, ...EXPO_DEPENDENCIES]
          .find(d => d.name === dep);
        console.log(`  ❌ ${dep}${info?.description ? ` - ${info.description}` : ''}`);
        if (info?.installCommand) {
          console.log(`     Install: ${info.installCommand}`);
        }
      });
      console.log('');
    }

    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
      });
      console.log('');
    }

    console.log('💡 To automatically install all dependencies, run:');
    console.log('   npx @fogo/sessions-sdk-react-native sessions-sdk-setup\n');
  }

  return result;
}

export function getDependencyInfo(packageName: string): DependencyInfo | undefined {
  return [...REQUIRED_DEPENDENCIES, ...UI_DEPENDENCIES, ...EXPO_DEPENDENCIES]
    .find(dep => dep.name === packageName);
}

export function getAllRequiredDependencies(): DependencyInfo[] {
  const dependencies = [...REQUIRED_DEPENDENCIES, ...UI_DEPENDENCIES];

  if (isExpoProject()) {
    dependencies.push(...EXPO_DEPENDENCIES);
  }

  return dependencies;
}