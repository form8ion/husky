import {promises as fs} from 'node:fs';
import core from '@form8ion/core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as execa from '../../thirdparty-wrappers/execa';
import * as scaffolder from '../scaffolder';
import {updateConfigToMatchInstalledVersion} from './config';

suite('config lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const scaffoldResults = any.simpleObject();
  const packageManager = any.word();
  const originalPackageContents = {
    ...any.simpleObject(),
    scripts: any.simpleObject()
  };

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'unlink');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(core, 'directoryExists');
    sandbox.stub(execa, 'default');
    sandbox.stub(scaffolder, 'default');

    scaffolder.default.withArgs({projectRoot, packageManager}).resolves(scaffoldResults);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({scripts: any.simpleObject()}));
    core.directoryExists.resolves(false);
  });

  teardown(() => sandbox.restore());

  test('that husky config is updated when v5 is installed, but config is still for v4', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.unlink, `${projectRoot}/.huskyrc.json`);
    assert.notCalled(fs.writeFile);
  });

  test('that husky config is updated when v5 is installed, but a v3 `commitMsg` hook is defined', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(false);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({
        ...originalPackageContents,
        scripts: {
          ...originalPackageContents.scripts,
          precommit: any.string()
        }
      }));
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(originalPackageContents));
    assert.notCalled(fs.unlink);
  });

  test('that husky config is updated when v5 is installed, but a v3 `commitmsg` hook is defined', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(false);
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({
        ...originalPackageContents,
        scripts: {
          ...originalPackageContents.scripts,
          commitmsg: any.string()
        }
      }));
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), scaffoldResults);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(originalPackageContents));
    assert.notCalled(fs.unlink);
  });

  test('that husky config is updated when greater than v5 is installed, but config is still for v4', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.1'}}})});

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), scaffoldResults);
  });

  test('that no next-step is listed when v4 is installed', async () => {
    core.fileExists.withArgs(`${projectRoot}/.huskyrc.json`).resolves(true);
    execa.default
      .withArgs('npm', ['ls', 'husky', '--json'])
      .resolves({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), {});
  });

  test('that no next-step is listed when v5 config exists', async () => {
    core.fileExists.resolves(false);
    core.directoryExists.withArgs(`${projectRoot}/.husky`).resolves(true);

    assert.deepEqual(await updateConfigToMatchInstalledVersion({projectRoot, packageManager}), {});
    assert.notCalled(execa.default);
    assert.notCalled(fs.unlink);
    assert.notCalled(fs.writeFile);
  });
});
