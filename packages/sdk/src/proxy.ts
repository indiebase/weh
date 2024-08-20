import http from 'node:http';

import httpProxy, { ServerOptions } from 'http-proxy';

export interface WehProxyOptions extends ServerOptions {
  rewritePath?: Record<string, string>;
  enableWebSocket?: boolean;
}

export function wehProxy(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  options?: WehProxyOptions,
) {
  options = Object.assign({}, { enableWebSocket: true }, options);
  const { rewritePath, enableWebSocket, ...rest } = options;
  const proxy = httpProxy.createProxyServer(rest);

  if (rewritePath) {
    for (const key in rewritePath) {
      if (Object.prototype.hasOwnProperty.call(rewritePath, key)) {
        const val = rewritePath[key];
        req.url = req.url?.replace(key, val);
      }
    }
  }

  proxy.web(req, res);

  if (enableWebSocket) {
    req.on('upgrade', (req, socket, head) => {
      proxy.ws(req, socket, head);
    });
  }
}
