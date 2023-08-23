const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  reactStrictMode: false,
  async redirects(){
    return [
      {
        source: '/profile',
        destination: '/home',
        permanent: true,
      },       
      {
        source: '/login',
        destination: '/chats',
        permanent: true,
      }                                
    ]
  }                                           
});
