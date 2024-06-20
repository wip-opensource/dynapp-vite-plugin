import { exec } from 'child_process';
import path from 'path';

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
