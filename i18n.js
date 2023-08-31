// eslint-disable-next-line no-undef
module.exports = {
    locales: ['en', 'ar'], // Array with the languages that you want to use
    defaultLocale: 'en', // Default language of your website
    pages: {
        '*': ['login', 'appHeader', 'bottomBar', 'routesNames', 'settings', 'appLogo', 'signUp', 'chatsPage'], // Namespaces that you want to import per page (we stick to one namespace for all the application in this tutorial)
    },
};
  