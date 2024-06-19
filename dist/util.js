import fs from 'fs';
import path from 'path';
export const getDynappConfig = () => {
    const findConfigFile = (currentDir) => {
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
