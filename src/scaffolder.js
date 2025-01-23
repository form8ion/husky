import {info} from '@travi/cli-messages';

import {scaffold as createConfigDirectory} from './hooks/index.js';
import {scaffold as createPreCommitHook} from './pre-commit/index.js';

export default async function ({projectRoot, packageManager, pathWithinParent}) {
  if (pathWithinParent) return {};

  info('Scaffolding Husky');

  await createConfigDirectory({projectRoot});

  await createPreCommitHook({projectRoot, packageManager});

  return {dependencies: {javascript: {development: ['husky@latest']}}, scripts: {prepare: 'husky'}};
}
