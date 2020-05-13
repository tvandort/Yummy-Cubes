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
    }

    return config;
  }
};
