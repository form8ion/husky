import core from '@form8ion/core';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as hookFileWriter from './writer.js';
import createHook from './scaffolder.js';

suite('hook creator', () => {
  let sandbox;
  const projectRoot = any.string();
  const hookName = any.word();
  const script = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(hookFileWriter, 'default');
    sandbox.stub(core, 'directoryExists');
  });

  teardown(() => sandbox.restore());

  test('that a hook file is created', async () => {
    core.directoryExists.withArgs(`${projectRoot}/.husky`).resolves(true);

    await createHook({projectRoot, hookName, script});

    assert.calledWith(hookFileWriter.default, {projectRoot, name: hookName, script});
  });

  test('that the hook file is not created if the config directory does not exist', async () => {
    core.directoryExists.resolves(false);

    await createHook({projectRoot, hookName, script});

    assert.notCalled(hookFileWriter.default);
  });
});
