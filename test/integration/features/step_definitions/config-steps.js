import {promises as fs} from 'fs';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import td from 'testdouble';
import any from '@travi/any';
import makeDir from '../../../../thirdparty-wrappers/make-dir';

export async function assertHookContainsScript(hook, script) {
  const hookContents = await fs.readFile(`${process.cwd()}/.husky/${hook}`, 'utf-8');

  assert.include(
    hookContents,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`
  );
  assert.include(hookContents, script);
}

Given('husky v5 is installed', async function () {
  td
    .when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});
});

Given('husky v4 is installed', async function () {
  td
    .when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});
});

Given('husky is not installed', async function () {
  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Given('husky config is in v4 format', async function () {
  await fs.writeFile(`${process.cwd()}/.huskyrc.json`, JSON.stringify(any.simpleObject()));
});

Given('husky config is in v5 format', async function () {
  await makeDir(`${process.cwd()}/.husky`);
});

Then('husky is configured for {string}', async function (packageManager) {
  assert.include(this.result.devDependencies, 'husky@latest');
  assert.equal(this.result.scripts.prepare, 'husky install');
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});
