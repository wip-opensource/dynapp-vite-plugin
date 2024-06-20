import { promises as fs } from 'fs';
import path from 'path';

async function updatePackageJson() {
    try {
        const projectName = path.basename(process.cwd());
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        
        // Read the existing package.json file
        const data = await fs.readFile(packageJsonPath, 'utf8');
        console.log('Read package.json successfully.');

        // Parse the JSON data
        const packageJson = JSON.parse(data);

        // Update the scripts
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
