import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as hookCreator from './hook-creator';
import scaffold from './scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(hookCreator, 'default');
  });

  teardown(() => sandbox.restore());

  test('that husky is configured', async () => {
    const projectRoot = any.string();
    const configDirectory = any.string();
    const packageManager = any.word();
    mkdir.default.withArgs(`${projectRoot}/.husky`).resolves(configDirectory);

    const {devDependencies} = await scaffold({projectRoot, packageManager});

    assert.deepEqual(devDependencies, ['husky']);
    assert.calledWith(hookCreator.default, {configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});
  });
});
