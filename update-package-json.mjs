import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the current directory of the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');

async function updatePackageJson() {
    try {
        // Read the existing package.json file
        const data = await fs.readFile(packageJsonPath, 'utf8');

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
