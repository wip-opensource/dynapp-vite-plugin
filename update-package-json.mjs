import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the current directory of the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the root directory (two levels up from node_modules)
const rootDir = path.resolve(__dirname, '../../');

// Path to the package.json file in the root directory
const packageJsonPath = path.join(rootDir, 'package.json');

async function updatePackageJson() {
    try {
        console.log('Updating package.json at:', packageJsonPath);

        // Read the existing package.json file
        const data = await fs.readFile(packageJsonPath, 'utf8');
        console.log('Read package.json successfully.');

        // Parse the JSON data
        const packageJson = JSON.parse(data);

        // Add or update the scripts
        packageJson.scripts = {
            ...packageJson.scripts,
            "build:publish": "vue-tsc --noEmit && vite build && dynapp-publish",
            "d-publish": "dynapp-publish"
        };

        // Write the updated package.json back to the file
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log('package.json has been updated successfully.');
    } catch (err) {
        console.error('Error updating package.json:', err);
    }
}

// Run the update function
updatePackageJson();
