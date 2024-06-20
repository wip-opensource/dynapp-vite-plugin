import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findPackageJson(currentDir) {
  if (currentDir.includes('node_modules')) {
    return null;
  }

  const packageJsonPath = path.join(currentDir, 'package.json');
  console.log(`Looking for package.json at ${packageJsonPath}`);

  if (fs.existsSync(packageJsonPath)) {
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
    const packageJsonPath = findPackageJson(process.cwd());

    if (!packageJsonPath) {
      console.error('package.json not found');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    console.log('Current package.json scripts:', packageJson.scripts);

    // Add scripts if they do not exist
    packageJson.scripts = packageJson.scripts || {};
    if (!packageJson.scripts['build:publish']) {
      packageJson.scripts['build:publish'] = 'vue-tsc --noEmit && vite build && dynapp-publish';
    }
    if (!packageJson.scripts['d-publish']) {
      packageJson.scripts['d-publish'] = 'dynapp-publish';
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with new scripts:', packageJson.scripts);
  } catch (error) {
    console.error('Failed to update package.json:', error);
  }
}

updatePackageJson();
