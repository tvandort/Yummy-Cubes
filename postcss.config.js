// Nextjs usually just uses strings for postcss.config.js but Storybook,
// claims that a string only config file is malformed. Instead use
// { "key": object }.

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-preset-env': {}
  }
};
