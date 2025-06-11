const withSourceMaps = require("@zeit/next-source-maps")();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const { SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, NODE_ENV } = process.env;

module.exports = {
  env: {
    APP_ENV: "local",
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_COMPANION_SERVER_URL: process.env.NEXT_PUBLIC_COMPANION_SERVER_URL,
    NEXT_PUBLIC_API_PRETRAINED_SERVER: process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER,
    NEXT_PUBLIC_FREE_PLAN: process.env.NEXT_PUBLIC_FREE_PLAN,
    NEXT_PUBLIC_STRIPE_SECRET_KEY_LIVE: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_LIVE,
    NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET: process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET,
  },
  webpack: (config, options) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/node. While
    // @sentry/browser will run in a Node.js environment, @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs#customizing-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      NODE_ENV === "production"
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: ".next",
          ignore: ["node_modules"],
          urlPrefix: "~/_next",
        })
      );
    }

    return config;
  },
};
