/** @type {import('next').NextConfig} */
module.exports = {
	webpack5: true,
	webpack: (config) => {
		config.resolve.fallback = { 
			fs: false,
			crypto: false,
			stream: false,
			path: false,
		 };

		return config;
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
