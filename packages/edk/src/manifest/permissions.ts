export const permissions = [
  /**
   * Get network state
   * Level: normal
   */
  'network:state',
  'network:internet',
  /**
   * Level: normal
   */
  'geolocation',
  /**
   * Level: normal
   */
  'storage',
  /**
   * Read external plugin storage
   * Level: dangerous
   */
  'database:write',
  'database:delete',
  'database:read',
  /**
   * System file systems (OPFS)
   * Level: dangerous
   * Web available
   */
  'fs:read',
  'fs:write',
] as const;

export type PermissionsManifest = Array<(typeof permissions)[number]>;
