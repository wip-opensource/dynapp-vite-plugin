#!/usr/bin/env node

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mainPath = resolve(__dirname, './main.js');
import(pathToFileURL(mainPath).toString()).catch(console.error);
