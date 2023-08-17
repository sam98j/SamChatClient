const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  reactStrictMode: false,
  async redirects(){
    return [
      // {
      //   source: '/',
      //   destination: '/login',
      //   permanent: true,
      // },
      // {
      //   source: '/chats',                                           
      //   destination: '/login',
      //   permanent: true,
      // },                                            
    ]
  }                                           
});
