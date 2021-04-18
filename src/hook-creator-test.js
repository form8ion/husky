import {promises as fs} from 'fs';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import createHook from './hook-creator';

suite('hook creator', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that a hook file is created', async () => {
    const configDirectory = any.string();
    const hookName = any.word();
    const script = any.string();

    await createHook({configDirectory, hookName, script});

    assert.calledWith(
      fs.writeFile, `${configDirectory}/${hookName}`,
      `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

${script}`,
      {mode: 0o755}
    );
  });
});
