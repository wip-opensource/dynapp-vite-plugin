import fs from 'fs';
import path from 'path';
import { DynappConfig } from './interface.js';

export const getDynappConfig = () => {
    const findConfigFile = (currentDir: string): DynappConfig => {
      const configPath = path.join(currentDir, 'dynappconfig.json');
      if (fs.existsSync(configPath)) {
        const rawData = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(rawData);
      }
      const parentDir = path.dirname(currentDir);
      if (currentDir === parentDir) {
        throw new Error('\n\n\ndynappconfig.json not found in any parent directories.\n\n\n');
      }
      return findConfigFile(parentDir);
    };
  
    return findConfigFile(process.cwd());
  };