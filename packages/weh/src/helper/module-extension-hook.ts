/**
 * Copyright (C) 2024 Han.
 * Copyright (c) 2012, Yahoo! Inc.
 *
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from 'node:fs';
import NodeModule from 'node:module';

import { logger } from './logger';

declare module 'module' {
  const _extensions: any;
}

function extensionInspect(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string extension, have ' + str);
  }
  if (str[0] !== '.') {
    throw new Error(
      'Extension should start with dot, for example .js, have ' + str,
    );
  }
}

export class NodeModuleExtHook {
  static #originalExtensionHandlers = new Map();

  /**
   *
   * @param ext file extensions
   * @param listener
   *
   * @example
   * ```ts
   * NodeModuleExtHook.on('.js', (filename, source)=>{
   *    return source;
   * })
   * ```
   */
  public static on(ext: string, listener) {
    extensionInspect(ext);
    const originalHandler = NodeModule._extensions[ext];

    if (originalHandler && !this.#originalExtensionHandlers.has(ext)) {
      this.#originalExtensionHandlers.set(ext, originalHandler);
    }

    NodeModule._extensions[ext] = async function (module, filename) {
      logger.debug('Transforming ' + filename);

      const source = fs.readFileSync(filename, 'utf8');
      const code = await listener(filename, source);

      if (typeof code === 'string') {
        module._compile(code, filename);
      } else {
        logger.error('Get source code from ' + filename + ' is not a string');
      }
    };
  }

  public static removeListener(ext: string) {
    extensionInspect(ext);

    if (this.#originalExtensionHandlers.has(ext)) {
      NodeModule._extensions[ext] = this.#originalExtensionHandlers.get(ext);
      this.#originalExtensionHandlers.delete(ext);
    } else {
      logger.error('No extension listener found for ' + ext);
    }
  }
}
