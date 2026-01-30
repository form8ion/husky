import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';

Given('the project has a legacy prepare script', async function () {
  this.originalPrepareScript = 'husky install';
});

Then('the prepare script uses the modern command', async function () {
  assert.equal(this.result.scripts.prepare, 'husky');
});
