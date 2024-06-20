import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updatePackageJson() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.error('package.json not found');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Add scripts if they do not exist
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['build:publish'] = 'vue-tsc --noEmit && vite build && dynapp-publish';
    packageJson.scripts['d-publish'] = 'dynapp-publish';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json');
  } catch (error) {
    console.error('Failed to update package.json:', error);
  }
}

updatePackageJson();
