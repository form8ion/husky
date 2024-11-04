import {promises as fs} from 'node:fs';
import core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import createHook from './scaffolder.js';

suite('hook creator', () => {
  let sandbox;
  const configDirectory = any.string();
  const hookName = any.word();
  const script = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(core, 'directoryExists');
  });

  teardown(() => sandbox.restore());

  test('that a hook file is created', async () => {
    core.directoryExists.withArgs(configDirectory).resolves(true);

    await createHook({configDirectory, hookName, script});

    assert.calledWith(fs.writeFile, `${configDirectory}/${hookName}`, script, {mode: 0o755});
  });

  test('that the hook file is not created if the config directory does not exist', async () => {
    core.directoryExists.resolves(false);

    await createHook({configDirectory, hookName, script});

    assert.notCalled(fs.writeFile);
  });
});
