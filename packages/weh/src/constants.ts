import { homedir } from 'node:os';
import { resolve } from 'node:path';

export const BUILT_IN_ROUTES = [];

export const EXTENSIONS_HOME = resolve(homedir(), '.weh');
