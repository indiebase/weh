/**
 * Copyright (C) 2023 Han, The Chromium Authors
 *
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Heuristic to check whether a given text was likely minified. Intended to
 * be used for HTML, CSS, and JavaScript inputs.
 *
 * A text is considered to be the result of minification if the average
 * line length for the whole text is 80 characters or more.
 *
 * https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/models/text_utils/TextUtils.ts#L336
 *
 * @param text The input text to check.
 * @returns
 */
export const detectMinified = function (text: string): boolean {
  let lineCount = 0;
  for (let lastIndex = 0; lastIndex < text.length; ++lineCount) {
    let eolIndex = text.indexOf('\n', lastIndex);
    if (eolIndex < 0) {
      eolIndex = text.length;
    }
    lastIndex = eolIndex + 1;
  }
  return (text.length - lineCount) / lineCount >= 80;
};
