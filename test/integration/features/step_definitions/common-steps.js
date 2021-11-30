import {resolve} from 'path';
import {After, Before, Given, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import any from '@travi/any';

let lift, scaffold, test;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  this.execa = td.replace('execa');
  this.originalPackageContents = {...any.simpleObject(), scripts: any.simpleObject()};

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold, test} = require('@form8ion/husky'));
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

  this.result = await scaffold({projectRoot: process.cwd(), packageManager: this.packageManager});
});

When('the husky details are lifted', async function () {
  stubbedFs({
    node_modules: stubbedNodeModules,
    ...'v5' === this.configFormat && {'.husky': {}},
    ...'v4' === this.configFormat && {'.huskyrc.json': JSON.stringify(any.simpleObject())},
    ...this.commitlintConfigContents && {'.commitlintrc.js': this.commitlintConfigContents},
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
  this.result = await test();
});
