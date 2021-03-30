import {promises as fs} from 'fs';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

export async function assertHookContainsScript(hook, script) {
  const hookContents = await fs.readFile(`${process.cwd()}/.husky/${hook}`, 'utf-8');

  assert.include(
    hookContents,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`
  );
  assert.include(hookContents, script);
}

Then('husky is configured for {string}', async function (packageManager) {
  assert.include(this.scaffoldResult.devDependencies, 'husky');
  assert.include(this.scaffoldResult.scripts.prepare, 'husky install');
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});
