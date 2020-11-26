// The following line sets up aliased imports. I thought that nextjs would do
// this for me but it turns out that this is not the case for any code running
// in a custom server. So many things need to be taken care of manually.
// The config for this is currently in package.json which means there are
// Three locations to change if you want to add an alias across all parts of
// this project.
// 1. tsconfig.json       - all frontend code and editor
// 2. This file.
// 3. jest.config.json    - all tests
// 4. .storybook/main.js  - all storybook files
import moduleAlias from 'module-alias';
import path from 'path';

// This might not be great if something changes? But for now dev mode
// contains the source files in ../src and build mode contains the source
// in ../../out. The server index is contained in both one level beneath source.
// So we can alias @app to the parent directory to have it alias the "root".
moduleAlias.addAlias('@app', path.join(__dirname, '../'));
