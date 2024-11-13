import {promises as fs} from 'fs';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import * as td from 'testdouble';

export async function assertHookContainsScript(hook, script) {
  const pathToHookFile = `${process.cwd()}/.husky/${hook}`;

  const hookContents = await fs.readFile(pathToHookFile, 'utf-8');

  assert.equal(hookContents, script);
  // eslint-disable-next-line no-bitwise
  assert.equal((`0${(await fs.stat(pathToHookFile)).mode}` & 0o777).toString(8), '755');
}

Given('husky v5 is installed', async function () {
  td.when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});
});

Given('husky v4 is installed', async function () {
  td.when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});
});

Given('husky v9 is installed', async function () {
  td.when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '9.1.6'}}})});
});

Given('husky is not installed', async function () {
  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Given('husky config is in v4 format', async function () {
  this.configFormat = 'v4';
});

Given('husky config is in v5 format', async function () {
  this.configFormat = 'v5';
});

Given('husky config is in v8 format', async function () {
  this.configFormat = 'v8';
});

Given('husky config is in v3 format', async function () {
  this.configFormat = 'v3';
});

Then('husky is configured for {string}', async function (packageManager) {
  assert.include(this.result.devDependencies, 'husky@latest');
  assert.equal(this.result.scripts.prepare, 'husky');
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});

Then('husky v5 is configured for {string}', async function (packageManager) {
  assert.equal(this.result.scripts.prepare, 'husky');
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});

Then('the v3 config is removed', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isUndefined(scripts.commitmsg);
  assert.isUndefined(scripts.precommit);
});

Then('the shebang is removed from hook scripts', async function () {
  const [precommitContent, commitmsgContent] = await Promise.all([
    fs.readFile(`${process.cwd()}/.husky/pre-commit`, 'utf-8'),
    fs.readFile(`${process.cwd()}/.husky/commit-msg`, 'utf-8')
  ]);

  assert.equal(precommitContent, `${this.packageManager} test`);
  assert.equal(commitmsgContent, 'npx --no-install commitlint --edit $1');
});
