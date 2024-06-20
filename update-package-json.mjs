import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findPackageJson(currentDir) {
  console.log(`Looking for package.json starting from ${currentDir}`);

  const packageJsonPath = path.join(currentDir, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    console.log(`Found package.json at ${packageJsonPath}`);
    return packageJsonPath;
  }

  const parentDir = path.dirname(currentDir);

  if (currentDir === parentDir) {
    return null;
  }

  return findPackageJson(parentDir);
}

async function updatePackageJson() {
  try {
    const packageJsonPath = findPackageJson(path.resolve(__dirname, '../../..')); // Starting the search outside node_modules

    if (!packageJsonPath) {
      console.error('package.json not found');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    console.log('Current package.json scripts:', packageJson.scripts);

    // Add scripts if they do not exist
    packageJson.scripts = packageJson.scripts || {};
    let updated = false;
    if (!packageJson.scripts['build:publish']) {
      packageJson.scripts['build:publish'] = 'vue-tsc --noEmit && vite build && dynapp-publish';
      updated = true;
    }
    if (!packageJson.scripts['d-publish']) {
      packageJson.scripts['d-publish'] = 'dynapp-publish';
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Updated package.json with new scripts:', packageJson.scripts);
    } else {
      console.log('No updates needed for package.json scripts');
    }
  } catch (error) {
    console.error('Failed to update package.json:', error);
  }
}

updatePackageJson();
