import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as hooksTester from '../hooks/tester.js';
import * as hooksLifter from '../hooks/lifter.js';
import * as config from './config.js';
import * as precommit from './commit-msg.js';
import lift from './lifter.js';

suite('lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const packageManager = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(config, 'updateConfigToMatchInstalledVersion');
    sandbox.stub(precommit, 'default');
    sandbox.stub(hooksTester, 'default');
    sandbox.stub(hooksLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that husky config is updated to match the installed version of husky', async () => {
    const configFormatResults = any.simpleObject();
    config.updateConfigToMatchInstalledVersion.withArgs({projectRoot, packageManager}).resolves(configFormatResults);
    hooksTester.default.withArgs({projectRoot}).resolves(true);

    assert.equal(await lift({projectRoot, packageManager}), configFormatResults);

    assert.calledWith(hooksLifter.default, {projectRoot});
    assert.calledWith(precommit.default, {projectRoot});
  });

  test('that hooks are not updated when modern config is not yet in place', async () => {
    hooksTester.default.withArgs({projectRoot}).resolves(false);

    await lift({projectRoot, packageManager});

    assert.notCalled(hooksLifter.default);
    assert.notCalled(precommit.default);
  });
});
