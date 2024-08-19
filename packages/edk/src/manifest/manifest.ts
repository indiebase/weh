import { PermissionsManifest } from './permissions';

export interface NetworkManifest {
  allow?: {
    /**
     * Allow visit domains
     */
    hosts?: string[];

    httpMethods?: string[];
  };
}

export interface AuthorManifest {
  /**
   * Author name
   */
  name: string;
  /**
   * Author avatar url
   */
  avatar?: string;
  /**
   * Author email
   */
  email: string;
  /**
   * Additional descriptions
   * Optional
   */
  additional: string;
}

export interface UpdateManifest {
  mode: 'npm' | 'github';
  registry: string;
}

export interface DependenciesManifest {
  allow?: {
    /**
     * npm packages
     * e.g.`react`, `express`
     */
    packages?: string[];
    /**
     * File extensions
     */
    extensions?: string[];
  };
}

export interface FsManifest {
  /**
   * Allow visit paths
   */
  allow?: string[];
}

export interface Manifest {
  /**
   * Headless app script entry.
   */
  headlessMain?: string;

  /**
   * GUI app script entry.
   */
  graphicalMain?: string;

  /**
   * Protection Levels:
   * @example
   * ```
   * Protection Levels:
   * | Value     | Meaning                                                      |
   * | --------- | ------------------------------------------------------------ |
   * | normal    | This is the lowest level of permission and does not require explicit user consent. These permissions do not typically pose a risk to the user's privacy or device security. |
   * | dangerous | A higher-risk permission that gives a requesting application access to private user data or control over the device that can negatively impact the user. |
   * ```
   */
  permissions?: PermissionsManifest;
  /**
   * App name
   */
  name: string;
  /**
   * App icon
   */
  icon?: string;
  /**
   * App display name
   */
  displayName?: string;
  /**
   * App version
   * @see {@link https://semver.org/}
   */
  version: string;
  /**
   * Register manifest version, should be Integer.
   */
  manifestVersion: number;
  /**
   * App author information.
   * {@link Author}
   */
  author: AuthorManifest;
  /**
   * Homepage url
   */
  homepage?: string;

  /**
   * Unique package name, this name should be unique in installed plugins
   *
   * @example com.deskbtm.indiebase.web-demo-extension
   * @see {@link https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html}
   */
  packageName: string;
  /**
   * App description
   */
  description?: string;
  /**
   * App update config.
   */
  update: UpdateManifest;
  /**
   * Available locates
   * ISO 3166-1 alpha-2 code
   * @see {@link https://github.com/annexare/Countries}
   */
  locates?: string[];
  /**
   * File system config, allowlist. web available.
   */
  fs?: FsManifest;
  /**
   * Network config, allowlist
   */
  network?: NetworkManifest;

  // To compact other versions
  [k: string]: unknown;
}
