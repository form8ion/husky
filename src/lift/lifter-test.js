import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as config from './config';
import lift from './lifter';

suite('lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const packageManager = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(config, 'updateConfigToMatchInstalledVersion');
  });

  teardown(() => sandbox.restore());

  test('that husky config is updated to match the installed version of husky', async () => {
    const configFormatResults = any.simpleObject();
    config.updateConfigToMatchInstalledVersion.withArgs({projectRoot, packageManager}).resolves(configFormatResults);

    assert.equal(await lift({projectRoot, packageManager}), configFormatResults);
  });
});
