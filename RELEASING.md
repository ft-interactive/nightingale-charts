# Release Process: Continuous Deployment

**Submitting a PR**
 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * `npm test` : Run the tests

**Accepting a PR**
 * Switch to the PR branch and review code
 * `npm test` : Run the tests
 * Merge the PR into master
 * `npm test` : Run the tests again
 * `npm run coverage` : take a look at the code coverage
 * `npm run bump` :
   * alternatively run `npm run bump -- [patch|minor|major|vx.x.x]`
 * `git push` : to kick of the deploy process


## Bump the Version

> Bump the version within your app

`npm run bump`

This will update the version number in all the docs (package.json, version.js, *.md and *.html).

By default, this applies a  `patch`.  Add a double-dash `patch`, `minor`, `major`, `prerelease` or even `v3.2.1` to specify the type of bump.

i.e. `npm run bump -- major`