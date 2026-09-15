'use strict';

module.exports = ({ env }) => ({
  auth: { secret: env('ADMIN_JWT_SECRET') },
  apiToken: { salt: env('API_TOKEN_SALT') },
  transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL', 'http://localhost:3000'),
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid).findOne({ documentId });
        if (!document) return null;

        const pathname = getPreviewPathname(uid, { locale, document });
        if (!pathname) return null;

        const params = new URLSearchParams({
          url: pathname,
          secret: env('PREVIEW_SECRET', 'preview-secret-token'),
          status,
        });

        return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${params}`;
      },
    },
  },
});

function getPreviewPathname(uid, { locale, document }) {
  const { slug } = document;

  switch (uid) {
    case 'api::battery.battery':
      if (!slug) return '/batteries';
      return `/batteries/${slug}`;
    case 'api::article.article':
      if (!slug) return '/blog';
      return `/blog/${slug}`;
    case 'api::brand.brand':
      if (!slug) return '/marques';
      return `/marques/${slug}`;
    default:
      return null;
  }
}
