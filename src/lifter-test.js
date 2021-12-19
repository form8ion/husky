import {promises as fs} from 'fs';
import * as core from '@form8ion/core';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as execa from '../thirdparty-wrappers/execa';
import * as scaffolder from './scaffolder';
import lift from './lifter';

suite('lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const scaffoldResults = any.simpleObject();
  const packageManager = any.word();
  const originalPackageContents = {...any.simpleObject(), scripts: any.simpleObject()};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'unlink');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(execa, 'default');
    sandbox.stub(scaffolder, 'default');

    scaffolder.default.withArgs({projectRoot, packageManager}).resolves(scaffoldResults);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({scripts: any.simpleObject()}));
  });

  teardown(() => sandbox.restore());

  test('that husky config is updated when v5 is installed, but config is still for v4', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await lift({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.unlink, `${projectRoot}/.huskyrc.json`);
    assert.notCalled(fs.writeFile);
  });

  test('that husky config is updated when v5 is installed, but a v3 `precommit` hook is defined', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(false);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({
        ...originalPackageContents, scripts: {...originalPackageContents.scripts, precommit: any.string()}
      }));
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await lift({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(originalPackageContents));
    assert.notCalled(fs.unlink);
  });

  test('that husky config is updated when v5 is installed, but a v3 `commitmsg` hook is defined', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(false);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({
        ...originalPackageContents,
        scripts: {...originalPackageContents.scripts, commitmsg: any.string()}
      }));
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await lift({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(originalPackageContents));
    assert.notCalled(fs.unlink);
  });

  test('that husky config is updated when greater than v5 is installed, but config is still for v4', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.1'}}})});

    assert.deepEqual(await lift({projectRoot, packageManager}), scaffoldResults);
  });

  test('that no next-step is listed when v4 is installed', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});

    assert.deepEqual(await lift({projectRoot, packageManager}), {});
  });

  test('that no next-step is listed when v5 is installed and v5 config exists', async () => {
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.6.7'}}})});
    core.fileExists.resolves(false);

    assert.deepEqual(await lift({projectRoot, packageManager}), {});
    assert.notCalled(fs.unlink);
    assert.notCalled(fs.writeFile);
  });

  test('that not having husky installed does not result in an error', async () => {
    const error = new Error('Command failed with exit code 1: npm ls husky --json');
    error.command = 'npm ls husky --json';
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(error);
    core.fileExists.resolves(any.boolean());

    await lift({projectRoot, packageManager});
  });

  test('that other errors from checking the husky installation are allowed to be thrown', async () => {
    const message = any.sentence();
    execa.default.withArgs('npm', ['ls', 'husky', '--json']).throws(new Error(message));
    core.fileExists.resolves(any.boolean());

    try {
      await lift({projectRoot, packageManager});

      throw new Error('An error should have been thrown by the check for husky installation details');
    } catch (e) {
      assert.equal(e.message, message);
    }
  });
});