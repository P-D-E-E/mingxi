const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
    fastRefresh: true,
};
module.exports = nextConfig;

module.exports = {
    //withContentlayer(nextConfig),
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        
        return config;
    },

    
}
