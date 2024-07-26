/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        // serverActions:,
        mdxRs:true,
        serverComponentsExternalPackages:['mongoose']
    },
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'*'
            },
            {
                protocol:'http',
                hostname:'*'
            },
        ]
    }
};

export default nextConfig;
