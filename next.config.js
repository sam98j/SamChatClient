// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const nextTranslate = require('next-translate-plugin');
const packageJson = require('./package.json');

// eslint-disable-next-line no-undef
module.exports = nextTranslate({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*',
        port: '2000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.chat.samapps.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'https://samchat.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
});
