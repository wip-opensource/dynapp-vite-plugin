import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const pluginUsage = 'plugins: [\n    DynappProxy(),';

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

updateViteConfig();
