# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](/pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the Nightingale locally, you'll need to install:
 * [NodeJS](http://nodejs.org/)
 * [Bower](http://bower.io/)

## pre-requisits

if behind a proxy run, setup git to use https:

 `git config --global url."https://".insteadOf git://`

## Workflow

1. Fork the project
2. `git clone repo-url` your fork
3. Setup your 'upstream'
`git remote add upstream https://github.com/ft-interactive/o-charts.git`
4. Run `npm i && bower i`
5. Create a topic branch to contain your change
`git checkout -b my-feature`
6. Hack, hack, hack
7. Check your changes in nightingale. [More Details >](#check-your-changes-in-nightingale)
7. Make sure [CHANGELOG.md](./CHANGELOG.md) includes a summary of your changes in a new version number heading
8. Make sure you are still up to date with master
`git pull upstream master`
9. If necessary, rebase your commits into logical chunks, without errors.
10. Push the branch up
`git push origin my-feature`
11. Create a pull request and describe what your change does and the why you think it should be merged.

## Running Locally

 * `npm start`
 * `npm test`

## Check your changes in nightingale

`o-chart` should be linked within bower and [nightingale](https://github.com/Financial-Times/nightingale) so that the changes can be checked locally.
Do this by:
 * `bower link` within o-charts root directory
 * `bower link o-charts` within nightingale root directory

When you have run nightingale locally to ensure any changes haven't broken it you can `unlink` in the same way.
