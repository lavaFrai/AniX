const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy({
  customDomain: "https://analytics.wah.su",
})({
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
});
