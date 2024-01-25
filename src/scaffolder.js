import {info} from '@travi/cli-messages';

import makeDir from '../thirdparty-wrappers/make-dir.js';
import createHook from './hook-creator.js';

async function createPreCommitHook(projectRoot, packageManager) {
  const configDirectory = await makeDir(`${projectRoot}/.husky`);

  await createHook({configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});
}

export default async function ({projectRoot, packageManager, pathWithinParent}) {
  if (pathWithinParent) return {};

  info('Scaffolding Husky');

  await createPreCommitHook(projectRoot, packageManager);

  return {devDependencies: ['husky@latest'], scripts: {prepare: 'husky'}};
}
