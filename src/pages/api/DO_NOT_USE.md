No reason to use nextjs api routes. There are downsides to using this.

Downsides include:

- Difficulty of testing.
- No easy way to inject data.
- No easy way to do middlewares.

Instead add api routes to server/routes where there's a custom express server.
