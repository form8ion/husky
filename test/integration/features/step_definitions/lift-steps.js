import {fileExists} from '@form8ion/core';
import {assert} from 'chai';
import {Then} from '@cucumber/cucumber';

Then('the next-steps include a warning about the husky config', async function () {
  assert.deepInclude(
    this.result.nextSteps,
    {summary: 'Husky configuration is outdated for the installed Husky version'}
  );
});

Then('the next-steps do not include a warning about the husky config', async function () {
  const {nextSteps} = this.result;

  if (nextSteps) {
    assert.notDeepInclude(nextSteps, {summary: 'Husky configuration is outdated for the installed Husky version'});
  }
});

Then('the v4 config is removed', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.huskyrc.json`));
});
