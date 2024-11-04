import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';

import {scaffold as createHook} from '../hook/index.js';

async function createPreCommitHook(projectRoot, packageManager) {
  await fs.mkdir(`${projectRoot}/.husky`);

  await createHook({projectRoot, hookName: 'pre-commit', script: `${packageManager} test`});
}

export default async function ({projectRoot, packageManager, pathWithinParent}) {
  if (pathWithinParent) return {};

  info('Scaffolding Husky');

  await createPreCommitHook(projectRoot, packageManager);

  return {devDependencies: ['husky@latest'], scripts: {prepare: 'husky'}};
}
