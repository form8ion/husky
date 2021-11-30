import * as core from '@form8ion/core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as hookCreator from '../hook-creator';
import precommit from './pre-commit';

suite('pre-commit', () => {
  let sandbox;
  const projectRoot = any.string();
  const configDirectory = `${projectRoot}/.husky`;
  const hookName = 'commit-msg';

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(hookCreator, 'default');
  });

  teardown(() => sandbox.restore());

  test('that a `commit-msg` hook is added if commitlint configuration exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.commitlintrc.js`).resolves(true);
    core.fileExists.withArgs(`${configDirectory}/${hookName}`).resolves(false);

    await precommit({projectRoot});

    assert.calledWith(
      hookCreator.default,
      {configDirectory, hookName, script: 'npx --no-install commitlint --edit $1'}
    );
  });

  test('that a `commit-msg` hook is not added if commitlint is not configured', async () => {
    core.fileExists.withArgs(`${projectRoot}/.commitlintrc.js`).resolves(false);
    core.fileExists.withArgs(`${configDirectory}/${hookName}`).resolves(false);

    await precommit({projectRoot});

    assert.neverCalledWith(
      hookCreator.default,
      {configDirectory, hookName, script: 'npx --no-install commitlint --edit $1'}
    );
  });

  test('that a `commit-msg` hook is not added if a `commit-msg` hook already exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.commitlintrc.js`).resolves(true);
    core.fileExists.withArgs(`${configDirectory}/${hookName}`).resolves(true);

    await precommit({projectRoot});

    assert.neverCalledWith(
      hookCreator.default,
      {configDirectory, hookName, script: 'npx --no-install commitlint --edit $1'}
    );
  });
});
