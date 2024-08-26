import '@deskbtm/gadgets/env';

import dotenvFlow from 'dotenv-flow';

import { WebExtensionHost } from './weh';

dotenvFlow.config();

const weh = await WebExtensionHost.warmup();

await weh.run({
  port: 8000,
});
