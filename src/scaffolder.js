import makeDir from '../thirdparty-wrappers/make-dir.js';
import createHook from './hook-creator.js';

export default async function ({projectRoot, packageManager, pathWithinParent}) {
  if (pathWithinParent) return {};

  const configDirectory = await makeDir(`${projectRoot}/.husky`);
  await createHook({configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});

  return {devDependencies: ['husky@latest'], scripts: {prepare: 'husky install'}};
}
