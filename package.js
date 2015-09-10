Package.describe({
  name: 'dispatch:twilio',
  version: '1.1.0',
  summary: 'Twilio api support for meteor.',
  git: 'https://github.com/DispatchMe/meteor-twilio.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    'check',
    'http',
    'mongo',
    'underscore'
  ], 'server');

  api.addFiles([
    'twilio.js',
  ], 'server');

  api.export('Twilio', 'server');
});

Package.onTest(function (api) {
  api.use([
    'tinytest',
    'dispatch:twilio'
  ], 'server');

  api.addFiles([
    'test.twilio.js'
  ], 'server');
});

Npm.depends({
  'twilio': '2.1.0'
});
