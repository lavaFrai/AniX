const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy({
  customDomain: "https://analytics.wah.su",
})({
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
