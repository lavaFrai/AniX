const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy({
  customDomain: "https://analytics.wah.su",
})({
  reactStrictMode: false,
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anixstatic.com",
      },
    ],
  },
});
