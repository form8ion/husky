import * as core from '@form8ion/core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as execa from '../../thirdparty-wrappers/execa';
import predicate from './tester';

suite('lift predicate', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(execa, 'default');
    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `false` is returned when the project is not using `husky`', async () => {
    const error = new Error('Command failed with exit code 1: npm ls husky --json');
    error.command = 'npm ls husky --json';
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(error);
    core.fileExists.resolves(any.boolean());

    assert.isFalse(await predicate());
  });

  test('that `true` is returned when husky is installed in the project', async () => {
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.isTrue(await predicate());
  });

  test('that other errors from checking the husky installation are allowed to be thrown', async () => {
    const message = any.sentence();
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(new Error(message));
    core.fileExists.resolves(any.boolean());

    try {
      await predicate();

      throw new Error('An error should have been thrown by the check for husky installation details');
    } catch (e) {
      assert.equal(e.message, message);
    }
  });
});
