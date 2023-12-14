// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const nextTranslate = require('next-translate-plugin');

// eslint-disable-next-line no-undef
module.exports = nextTranslate({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'sam-hp-elitebook-820-g2',
        port: '2000',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // {
      //     source: '/profile',
      //     destination: '/',
      //     permanent: true,
      // }
    ];
  },
});
