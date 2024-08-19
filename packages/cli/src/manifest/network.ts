export interface HttpRoutesScope {
  method: string;
  path: string;
}

export interface HttpManifest {
  /**
   * Register server routes.
   */
  routes?: HttpRoutesScope[];
}

export interface NetworkManifest {
  allow?: {
    /**
     * Allow visit domains
     */
    hosts?: string[];
  };

  /**
   * Http manifest.
   */
  http?: HttpManifest;
}
