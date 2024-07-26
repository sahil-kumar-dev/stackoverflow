/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        // serverActions:,
        mdxRs:true,
        serverComponentsExternalPackages:['mongoose']
    }
};

export default nextConfig;
