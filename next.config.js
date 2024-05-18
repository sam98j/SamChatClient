// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const nextTranslate = require('next-translate-plugin');

// eslint-disable-next-line no-undef
module.exports = nextTranslate({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.216.78',
        port: '2000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.chat.samapps.xyz',
        pathname: '/**',
      },
    ],
  },
});
