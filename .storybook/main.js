const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-typescript',
    '@storybook/addon-actions',
    '@storybook/addon-links'
  ],
  webpackFinal: async (config) => {
    // do mutation to the config

    // Allow aliased imports to @app in storybook files.
    config.resolve.alias['@app'] = path.resolve(__dirname, '../src');

    return config;
  }
};
