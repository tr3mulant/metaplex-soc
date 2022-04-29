const shouldAnalyzeBundles = process.env.ANALYZE === 'true';

let nextConfig = {
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

if (shouldAnalyzeBundles) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
