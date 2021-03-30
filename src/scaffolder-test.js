import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as core from '@form8ion/core';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as hookCreator from './hook-creator';
import scaffold from './scaffolder';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const configDirectory = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(hookCreator, 'default');
    sandbox.stub(core, 'fileExists');

    mkdir.default.withArgs(`${projectRoot}/.husky`).resolves(configDirectory);
  });

  teardown(() => sandbox.restore());

  test('that husky is configured', async () => {
    const packageManager = any.word();
    core.fileExists.resolves(false);

    const {devDependencies, scripts} = await scaffold({projectRoot, packageManager});

    assert.deepEqual(devDependencies, ['husky']);
    assert.equal(scripts.prepare, 'husky install');
    assert.calledWith(hookCreator.default, {configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});
    assert.neverCalledWith(
      hookCreator.default,
      {configDirectory, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'}
    );
  });

  test('that a commit-msg hook is added if commitlint configuration exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.commitlintrc.js`).resolves(true);

    await scaffold({projectRoot});

    assert.calledWith(
      hookCreator.default,
      {configDirectory, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'}
    );
  });
});
