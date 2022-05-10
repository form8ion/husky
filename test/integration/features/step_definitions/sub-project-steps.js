import {directoryExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('the project being scaffolded is a sub-project', async function () {
  this.pathWithinParent = any.string();
});

Then('no husky configuration is added', async function () {
  const {devDependencies, scripts} = this.result;

  assert.isUndefined(devDependencies);
  assert.isUndefined(scripts);
  assert.isFalse(await directoryExists(`${process.cwd()}/.husky`));
});
