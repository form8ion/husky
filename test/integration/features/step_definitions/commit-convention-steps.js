import {fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

import {assertHookContainsScript} from './config-steps.js';

Given('no commit convention is defined', async function () {
  return undefined;
});

Given('commitlint is configured for the project', async function () {
  this.commitlintConfigContents = JSON.stringify(any.simpleObject());
});

Then('no commit-msg hook is defined', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.husky/commit-msg`));
});

Then('commitlint is configured as a commit-msg hook', async function () {
  await assertHookContainsScript('commit-msg', 'npx --no-install commitlint --edit $1');
});
