import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updatePackageJsonPath = path.resolve(__dirname, 'update-package-json.mjs');

exec(`node ${updatePackageJsonPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing script: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Script error output: ${stderr}`);
    return;
  }

  console.log(`Script output: ${stdout}`);
});
