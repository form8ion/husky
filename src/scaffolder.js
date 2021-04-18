import {fileExists} from '@form8ion/core';
import makeDir from '../thirdparty-wrappers/make-dir';
import createHook from './hook-creator';

export default async function ({projectRoot, packageManager}) {
  const configDirectory = await makeDir(`${projectRoot}/.husky`);
  await createHook({configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});

  if (await fileExists(`${projectRoot}/.commitlintrc.js`)) {
    await createHook({configDirectory, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'});
  }

  return {devDependencies: ['husky@latest'], scripts: {prepare: 'husky install'}};
}
