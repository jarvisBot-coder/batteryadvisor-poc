'use strict';

module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:1337', 'http://localhost:3000'],
          'media-src': ["'self'", 'data:', 'blob:', 'http://localhost:1337'],
          upgradeInsecureRequests: null,
        },
      },
      // Allow the Next.js frontend (different origin) to embed uploaded media.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'http://localhost:1337'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
