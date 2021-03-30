import {resolve} from 'path';
import {After, Before, Given, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

let scaffold;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold} = require('@form8ion/husky'));

  stubbedFs({
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

Given('{string} is the package manager', async function (packageManager) {
  this.packageManager = packageManager;
});

When('the project is scaffolded', async function () {
  this.scaffoldResult = await scaffold({projectRoot: process.cwd(), packageManager: this.packageManager});
});
