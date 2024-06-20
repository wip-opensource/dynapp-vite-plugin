import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to update package.json
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

// Function to recursively find vite.config.mts
function findViteConfig(currentDir) {
  const viteConfigPath = path.join(currentDir, 'vite.config.mts');

  if (fs.existsSync(viteConfigPath)) {
    return viteConfigPath;
  }

  const parentDir = path.dirname(currentDir);
  
  if (currentDir === parentDir) {
    return null;
  }

  return findViteConfig(parentDir);
}

// Function to update vite.config.mts
async function updateViteConfig() {
  try {
    const viteConfigPath = findViteConfig(process.cwd());

    if (!viteConfigPath) {
      console.error('vite.config.mts not found');
      process.exit(1);
    }

    const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');

    // Check if the plugin is already imported
    if (!viteConfigContent.includes('DynappProxy')) {
      const importStatement = "import { DynappProxy } from 'dynapp-publish-vue3';\n";
      const pluginUsage = '  plugins: [\n    DynappProxy(),\n';

      const updatedContent = viteConfigContent
        .replace(/^import/m, `${importStatement}import`)
        .replace(/plugins: \[/, pluginUsage);

      fs.writeFileSync(viteConfigPath, updatedContent);
      console.log('Updated vite.config.mts');
    } else {
      console.log('vite.config.mts already updated');
    }
  } catch (error) {
    console.error('Failed to update vite.config.mts:', error);
  }
}

// Run the update functions
updatePackageJson().then(updateViteConfig);
