# Yummy Cubes

Me trying to make an online Rummikub style game.

## Development

Install [yarn](https://classic.yarnpkg.com/lang/en/).

Run `yarn` then `yarn dev`.

Run `yarn storybook` to see component previews.

(NOTE yarn isn't typechecked yet)

## Testing

Run `yarn test` to run locally in a watcher.

Run `yarn test:ci` to run without a watcher.

All pushes should have tests run by the GitHub workflow.

## Deploy

Each PR should create a preview deploy on Heroku.

Merging to master should deploy "production" (quotes because its not really in production yet.)
