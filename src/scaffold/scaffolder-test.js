import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as mkdir from '../../thirdparty-wrappers/make-dir.js';
import * as hookCreator from '../hook/scaffolder.js';
import scaffold from './scaffolder.js';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const configDirectory = any.string();
  const packageManager = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(hookCreator, 'default');

    mkdir.default.withArgs(`${projectRoot}/.husky`).resolves(configDirectory);
  });

  teardown(() => sandbox.restore());

  test('that husky is configured', async () => {
    const {devDependencies, scripts} = await scaffold({projectRoot, packageManager});

    assert.deepEqual(devDependencies, ['husky@latest']);
    assert.equal(scripts.prepare, 'husky');
    assert.calledWith(hookCreator.default, {configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});
  });

  test('that configuration is not applied if the project being scaffolded is a sub-project', async () => {
    const {devDependencies, scripts} = await scaffold({projectRoot, packageManager, pathWithinParent: any.string()});

    assert.isUndefined(devDependencies);
    assert.isUndefined(scripts);

    assert.notCalled(hookCreator.default);
    assert.notCalled(mkdir.default);
  });
});
