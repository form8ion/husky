# husky

opinionated scaffolder for configuring [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
using [husky](https://typicode.github.io/husky)

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
  * [API](#api)
    * [`scaffold`](#scaffold)
      * [`projectRoot` __string__ (_required_)](#projectroot-string-required)
      * [`packageManager` __string__ (_required_)](#packagemanager-string-required)
    * [`test`](#test)
    * [`lift`](#lift)
      * [`projectRoot` __string__ (_required_)](#projectroot-string-required-1)
      * [`packageManager` __string__ (_required_)](#packagemanager-string-required-1)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/husky on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/husky --save
```

### Example

#### Import

```javascript
import {lift, scaffold, test} from './lib/index.cjs';
```

#### Execute

```javascript
(async () => {
  await scaffold({projectRoot: process.cwd(), packageManager: 'foo'});

  await test({projectRoot: process.cwd()});

  await lift({projectRoot: process.cwd(), packageManager: 'foo'});
})();
```

### API

#### `scaffold`

Scaffolder for configuring git hooks programatically through the use of [husky](https://github.com/typicode/husky)

Takes a single options object as an argument, containing:

##### `projectRoot` __string__ (_required_)

path to the root of the project

##### `packageManager` __string__ (_required_)

chosen [package manager](https://github.com/form8ion/javascript-core#packagemanagers)
to be used for the project

##### `pathWithinParent` __string__ (_optional_)

path within a parent project when scaffolding a sub-project

#### `test`

Predicate for determining whether the `lift` functionality should be applied to
the current project.
Identifies if [husky](https://github.com/typicode/husky) is currently in use
for the project.

Takes a single options object as an argument, containing:

##### `projectRoot` __string__ (_required_)

path to the root of the project

#### `lift`

Lifter for adjusting configuration of git hooks programatically through the use
of [husky](https://github.com/typicode/husky)

Takes a single options object as an argument, containing:

##### `projectRoot` __string__ (_required_)

path to the root of the project

##### `packageManager` __string__ (_required_)

chosen [package manager](https://github.com/form8ion/javascript-core#packagemanagers)
to be used for the project

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/husky/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://github.com/form8ion/husky/workflows/Node.js%20CI/badge.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/husky.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/husky

[npm-badge]: https://img.shields.io/npm/v/@form8ion/husky.svg

[runkit-link]: https://npm.runkit.com/@form8ion/husky

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/husky.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/husky?logo=node.js
