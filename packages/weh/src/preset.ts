import '@deskbtm/gadgets/env';

import dotenvFlow from 'dotenv-flow';

import { WebExtensionHost } from './weh';

dotenvFlow.config();

WebExtensionHost.warmup().run({
  port: 8000,
});
