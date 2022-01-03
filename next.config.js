/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_IEX_TOKEN: process.env.IEX_TOKEN,
	},
};
