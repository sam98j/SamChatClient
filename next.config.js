// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const nextTranslate = require('next-translate-plugin');

// eslint-disable-next-line no-undef
module.exports = nextTranslate({
    reactStrictMode: false,
    async redirects(){
        return [
            // {
            //     source: '/profile',
            //     destination: '/',
            //     permanent: true,
            // }                             
        ];
    }                                           
});
