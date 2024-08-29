import { homedir, tmpdir } from 'node:os';
import { resolve } from 'node:path';

export const BUILT_IN_ROUTES = [];

export const WEH = 'weh';

export const EXTENSIONS_HOME = resolve(homedir(), '.weh/extensions');

export const EXTENSIONS_TMP = resolve(tmpdir(), WEH);

export const WEH_LOG_PATH = resolve(EXTENSIONS_HOME, 'log');
