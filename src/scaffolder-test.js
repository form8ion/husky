import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import scaffold from './scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
  });

  teardown(() => sandbox.restore());

  test('that husky is configured', async () => {
    const projectRoot = any.string();
    const {devDependencies} = await scaffold({projectRoot});

    assert.deepEqual(devDependencies, ['husky']);
    assert.calledWith(mkdir.default, `${projectRoot}/.husky`);
  });
});
