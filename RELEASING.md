# Release Process: Continuous Deployment

> The version number must be incremented manually before code is pushed to Git.

 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * Merge your changes into master
 * `npm test` : Run the tests again
 * `npm run bump` : Patch the version number
   * alternatively run `npm run bump -- [patch|minor|major|vx.x.x]`
 * `git push` : to kick of the deploy process
 * CircleCI will then run your test, tag the new release within git and deploy.

