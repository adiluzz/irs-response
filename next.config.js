/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't bundle PDFKit - it needs access to font data files in node_modules
  serverExternalPackages: ['pdfkit'],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure PDFKit and its dependencies are not bundled
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('pdfkit');
      } else {
        config.externals = [config.externals, 'pdfkit'];
      }
    }
    return config;
  },
};

module.exports = nextConfig;
