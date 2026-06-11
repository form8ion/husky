import {scaffold as createConfigDirectory} from './hooks/index.js';
import {scaffold as createPreCommitHook} from './pre-commit/index.js';

export default async function ({projectRoot, packageManager, pathWithinParent}, dependencies) {
  if (pathWithinParent) return {};

  const {logger} = dependencies;

  logger.info('Scaffolding Husky');

  await createConfigDirectory({projectRoot});

  await createPreCommitHook({projectRoot, packageManager}, dependencies);

  return {dependencies: {javascript: {development: ['husky@latest']}}, scripts: {prepare: 'husky'}};
}
