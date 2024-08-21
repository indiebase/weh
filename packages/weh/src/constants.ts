import { homedir } from 'node:os';
import { resolve } from 'node:path';

export const BUILT_IN_ROUTES = [];

export const EXTENSIONS_HOME = resolve(homedir(), '.weh');

export const WEH = 'weh';

export const WEH_LOG_PATH = resolve(EXTENSIONS_HOME, 'log');
