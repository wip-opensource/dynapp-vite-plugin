#!/usr/bin/env node
import { register } from 'ts-node';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
register({
    project: resolve(__dirname, '../tsconfig.json')
});
const mainPath = resolve(__dirname, './main.js');
import(pathToFileURL(mainPath).toString()).catch(console.error);
