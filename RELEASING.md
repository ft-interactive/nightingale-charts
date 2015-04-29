# Release Process: Continuous Deployment

**Submitting a PR**
 * Please read [Contributing.md](CONTRIBUTING.md)

**Accepting a PR**
 * Review code within GitHub
 * Checkout the PR branch (as stated in git hub)
 * Merge master
 * `npm test` : Run the tests
 * Merge the PR into master
 * `npm run bump` :
   * alternatively run `npm run bump -- [patch|minor|major|vx.x.x]`
 * `npm test` : Run the tests again
 * Add and Commit version changes
 * `npm run report` : take a look at the code coverage
 * `git push` : to kick of the deploy process

## Bump the Version

> Bump the version within your app

`npm run bump`

This will update the version number in all the docs (package.json, version.js, *.md and *.html).

By default, this applies a  `patch`.  Add a double-dash `patch`, `minor`, `major`, `prerelease` or even `v3.2.1` to specify the type of bump.

i.e. `npm run bump -- major`
