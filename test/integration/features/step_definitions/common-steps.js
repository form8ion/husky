import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, Given, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import any from '@travi/any';

let lift, scaffold, test;
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.execa = (await td.replaceEsm('execa')).execa;
  this.originalPackageContents = {...any.simpleObject(), scripts: any.simpleObject()};

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold, test} = await import('@form8ion/husky'));
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

Given('{string} is the package manager', async function (packageManager) {
  this.packageManager = packageManager;
});

When('the project is scaffolded', async function () {
  stubbedFs({
    node_modules: stubbedNodeModules,
    ...'v5' === this.configFormat && {'.husky': {}},
    ...'v4' === this.configFormat && {'.huskyrc.json': JSON.stringify(any.simpleObject())},
    'package.json': JSON.stringify({
      ...this.originalPackageContents,
      scripts: {
        ...this.originalPackageContents.scripts,
        ...'v3' === this.configFormat && {precommit: any.string(), commitmsg: any.string()}
      }
    })
  });

  this.result = await scaffold({
    projectRoot: process.cwd(),
    packageManager: this.packageManager,
    pathWithinParent: this.pathWithinParent
  });
});

When('the husky details are lifted', async function () {
  stubbedFs({
    node_modules: stubbedNodeModules,
    ...'v8' === this.configFormat && {
      '.husky': {
        'commit-msg': `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1`,
        'pre-commit': `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test`,
        _: {
          h: any.string()
        }
      }
    },
    ...'v5' === this.configFormat && {'.husky': {}},
    ...'v4' === this.configFormat && {'.huskyrc.json': JSON.stringify(any.simpleObject())},
    ...this.commitlintConfigContents && {'.commitlintrc.json': this.commitlintConfigContents},
    'package.json': JSON.stringify({
      ...this.originalPackageContents,
      scripts: {
        ...this.originalPackageContents.scripts,
        ...'v3' === this.configFormat && {precommit: any.string(), commitmsg: any.string()}
      }
    })
  });

  this.result = await lift({projectRoot: process.cwd(), packageManager: this.packageManager});
});

When('the predicate is evaluated against a project', async function () {
  stubbedFs({
    ...'v5' === this.configFormat && {'.husky': {}},
    node_modules: stubbedNodeModules
  });

  this.result = await test({projectRoot: process.cwd()});
});
