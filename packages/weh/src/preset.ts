import '@deskbtm/gadgets/env';

import dotenvFlow from 'dotenv-flow';

import { logger } from './helper';
import { WebExtensionHost } from './weh';

dotenvFlow.config();

logger.error(new Error());

// const weh = await WebExtensionHost.warmup();

// await weh.run({
//   port: 8000,
// });
