# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](/pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the Nightingale locally, you'll need to install:
 * [NodeJS](http://nodejs.org/)
 * [Bower](http://bower.io/)

## pre-requisits

1. `git clone git@github.com:ft-interactive/o-charts.git`
2. `npm i`

if behind a proxy run, setup git to use https:
 * `git config --global url."https://".insteadOf git://`

## Workflow

1. Run `npm run regression` to create reference shots
2. Run `git checkout -b my-feature`
3. Hack, test, hack, test
1. Run `npm run regression`
1. Run `npm run sort-regression`
1. Manually check the folders within `test/regression` (new, failures + reference)
4. `git rebase master`
5. If necessary, rebase your commits into logical chunks, without errors.
6. `git push origin my-feature`
7. Create a pull request and describe what your change does and the why you think it should be merged.

## Running Locally

 * `npm start`
 * `npm test`

## Check your changes in nightingale

`o-charts` should be linked within bower and [nightingale](https://github.com/Financial-Times/nightingale) so that the changes can be checked locally.
Do this by:
 * `bower link` within o-charts root directory
 * `bower link o-charts` within nightingale root directory

When you have run nightingale locally to ensure any changes haven't broken it you can `unlink` in the same way.
