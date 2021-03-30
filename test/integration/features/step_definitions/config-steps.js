import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {directoryExists} from '@form8ion/core';

Then('husky is configured', async function () {
  assert.include(this.scaffoldResult.devDependencies, 'husky');
  assert.isTrue(await directoryExists(`${process.cwd()}/.husky`));
});
