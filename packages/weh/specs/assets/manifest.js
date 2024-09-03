'use strict';
import * as main from './main';

console.log(main);

export default {
  type: 'headless',
  permissions: [
    'network:state',
    'network:internet',
    'geolocation',
    'storage:local',
    'storage:db',
    'clipboard:write',
    'clipboard:read',
    'storage:external:APP_NAME:local',
    'storage:external:APP_NAME:db',
    'fs:read',
    'fs:write',
  ],
  name: 'Test extension sample',
  version: '0.0.1',
  manifestVersion: 1,
  publisher: {
    name: 'Han',
    avatar:
      'https://avatars.githubusercontent.com/u/45007226?s=400&u=8e6ce9e05f673f26ccaf19b792f74fe9c7b7f39e&v=4',
    email: 'han@deskbtm.com',
    additional: '',
  },
  homepage: '',
  packageName: 'com.deskbtm.indiebase.weh.test-sample',
  description: 'Weh test extension',
  update: {
    mode: 'npm',
    registry: 'https://npm.com',
  },
  locates: ['en'],
  network: {
    allow: {
      hosts: ['https://indiebase.deskbtm.com'],
    },
  },
};
