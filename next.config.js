const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Add eslint to webpack. Fail on warning and on error so that the
      // error overlay shows up on dev.
      config.module.rules.push({
        test: /\.((t|j)sx?)$/,
        loader: "eslint-loader",
        exclude: [/node_modules/, "/.next/"],
        enforce: "pre",
        options: { failOnWarning: true, failOnError: true }
      });

      // Add a typescript error overlay. `async: false` makes the compilation
      // slower but it allows the error overlay in the browser.
      // If compilation speed ever becomes a real concern enable async and deal
      // with console error messages.
      config.plugins.push(new ForkTsCheckerWebpackPlugin({ async: false }));
    }

    return config;
  }
};
