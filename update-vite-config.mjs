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

    let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');

    // Check if the plugin is already imported
    if (!viteConfigContent.includes('DynappProxy')) {
      const importStatement = "import { DynappProxy } from 'dynapp-vite-plugin';\n";

      // Insert the import statement at the top of the file
      if (!viteConfigContent.includes(importStatement)) {
        viteConfigContent = importStatement + viteConfigContent;
      }

      // Use a regular expression to insert the plugin into the plugins array
      const pluginsRegex = /plugins:\s*\[/;
      viteConfigContent = viteConfigContent.replace(pluginsRegex, match => `${match}\n    DynappProxy(),`);

      fs.writeFileSync(viteConfigPath, viteConfigContent);
      console.log('Updated vite.config.mts');
    } else {
      console.log('vite.config.mts already updated');
    }
  } catch (error) {
    console.error('Failed to update vite.config.mts:', error);
  }
}

updateViteConfig();
