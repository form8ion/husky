import {resolve} from 'path';
import {After, Before, Given, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import any from '@travi/any';

let lift, scaffold;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  this.execa = td.replace('execa');
  this.originalPackageContents = {...any.simpleObject(), scripts: any.simpleObject()};

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold} = require('@form8ion/husky'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    'package.json': JSON.stringify(this.originalPackageContents)
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

Given('{string} is the package manager', async function (packageManager) {
  this.packageManager = packageManager;
});

When('the project is scaffolded', async function () {
  this.result = await scaffold({projectRoot: process.cwd(), packageManager: this.packageManager});
});

When('the husky details are lifted', async function () {
  this.result = await lift({projectRoot: process.cwd(), packageManager: this.packageManager});
});
