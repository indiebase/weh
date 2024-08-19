import type { Manifest } from '@indiebase/weh-sdk';

export default {
  type: 'headless',
  permissions: [
    'network:state',
    'network:internet',
    'geolocation',
    'storage',
    'database:read',
    'database:write',
    'database:delete',
    'fs:read',
    'fs:write',
  ],
  name: 'Invite new users',
  version: '0.0.1',
  manifestVersion: 1,
  author: {
    name: 'Han',
    avatar:
      'https://avatars.githubusercontent.com/u/45007226?s=400&u=8e6ce9e05f673f26ccaf19b792f74fe9c7b7f39e&v=4',
    email: 'han@deskbtm.com',
    additional: '',
  },
  homepage: '',
  packageName: 'com.deskbtm.indiebase.ext.invitation',
  description: 'Indiebase extension: Invite new users',
  update: {
    mode: 'npm',
    registry: 'https://npm.com',
  },
  locates: ['en'],
  db: {
    allow: ['users'],
  },
  storage: {
    allow: ['image/png'],
  },
  fs: {
    allow: [],
  },
  network: {
    allow: {
      hosts: [
        'https://indiebase.deskbtm.com',
        'https://avatars.githubusercontent.com',
      ],
    },
  },
} satisfies Manifest;
