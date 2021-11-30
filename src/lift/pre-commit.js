import {fileExists} from '@form8ion/core';

import createHook from '../hook-creator';

export default async function ({projectRoot}) {
  const configDirectory = `${projectRoot}/.husky`;
  const hookName = 'commit-msg';

  if (await fileExists(`${projectRoot}/.commitlintrc.js`) && !(await fileExists(`${configDirectory}/${hookName}`))) {
    await createHook({configDirectory, hookName, script: 'npx --no-install commitlint --edit $1'});
  }
}
