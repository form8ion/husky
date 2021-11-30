import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

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

    mkdir.default.withArgs(`${projectRoot}/.husky`).resolves(configDirectory);
  });

  teardown(() => sandbox.restore());

  test('that husky is configured', async () => {
    const packageManager = any.word();

    const {devDependencies, scripts} = await scaffold({projectRoot, packageManager});

    assert.deepEqual(devDependencies, ['husky@latest']);
    assert.equal(scripts.prepare, 'husky install');
    assert.calledWith(hookCreator.default, {configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});
  });
});
