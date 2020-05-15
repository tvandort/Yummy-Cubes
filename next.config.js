const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.((t|j)sx?)$/,
        loader: "eslint-loader",
        exclude: [/node_modules/, "/.next/"],
        enforce: "pre",
        options: { failOnWarning: true, failOnError: true }
      });

      config.plugins.push(new ForkTsCheckerWebpackPlugin({ async: false }));
    }

    return config;
  }
};
