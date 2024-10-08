import detectObfuscation from 'obfuscation-detector';
import { EXTENSIONS_HOME } from 'src/constants';

import { InteractiveError, isWithinPath } from '../helper';
import { detectMinified } from './utils';

export type ObfuscationTypes =
  | ''
  | 'array_function_replacements'
  | 'array_replacements'
  | 'augmented_array_replacements'
  | 'augmented_proxied_array_function_replacements'
  | 'caesar_plus'
  | 'function_to_array_replacements'
  | 'augmented_array_function_replacements';

export async function runtimeSecurityCheckup(filename: string, source: string) {
  const isMinified = detectMinified(source);
  const obfuscatedType: ObfuscationTypes = await detectObfuscation(source);

  if (isMinified) {
    throw new InteractiveError(
      `Source code should not be minified, please check it again.`,
    );
  }

  if (obfuscatedType) {
    throw new InteractiveError(
      `Source code should not be obfuscated, Obfuscation type is probably ${obfuscatedType}, please check it again.`,
    );
  }

  return true;
}

export function sourceCodePathCheckup(path: string) {
  return isWithinPath(path, EXTENSIONS_HOME);
}
