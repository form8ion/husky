import core from '@form8ion/core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as execa from '../../thirdparty-wrappers/execa.js';
import predicate from './tester.js';

suite('lift predicate', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(execa, 'default');
    sandbox.stub(core, 'directoryExists');

    core.directoryExists.resolves(false);
  });

  teardown(() => sandbox.restore());

  test('that `false` is returned when the project is not using `husky`', async () => {
    const error = new Error('Command failed with exit code 1: npm ls husky --json');
    error.command = 'npm ls husky --json';
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(error);

    assert.isFalse(await predicate({projectRoot}));
  });

  test('that `true` is returned is the modern config directory exists', async () => {
    core.directoryExists.withArgs(`${projectRoot}/.husky`).resolves(true);
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(new Error('error from test'));

    assert.isTrue(await predicate({projectRoot}));
  });

  test('that `true` is returned when husky is installed in the project', async () => {
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.isTrue(await predicate({projectRoot}));
  });

  test('that other errors from checking the husky installation are allowed to be thrown', async () => {
    const message = any.sentence();
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(new Error(message));

    try {
      await predicate({projectRoot});

      throw new Error('An error should have been thrown by the check for husky installation details');
    } catch (e) {
      assert.equal(e.message, message);
    }
  });
});
