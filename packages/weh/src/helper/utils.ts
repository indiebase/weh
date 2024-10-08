import { pathToFileURL } from 'node:url';

import { ContextOptions, Isolate, IsolateOptions } from 'isolated-vm';

export const importScript = async function (path: string) {
  const r = await import(pathToFileURL(path).toString());
  return r?.default ?? r;
};

export const isWithinPath = function (child: string, parent: string) {
  if (child === parent) return false;
  const parentTokens = parent.split('/').filter((i) => i.length);
  const childTokens = child.split('/').filter((i) => i.length);
  return parentTokens.every((t, i) => childTokens[i] === t);
};

export const createIsolate = async function (
  options?: IsolateOptions,
  contextOptions?: ContextOptions,
) {
  const isolate = new Isolate(options);
  const context = await isolate.createContext(contextOptions);

  return { isolate, context } as const;
};
