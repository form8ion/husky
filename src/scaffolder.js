import makeDir from '../thirdparty-wrappers/make-dir';
import createHook from './hook-creator';

export default async function ({projectRoot, packageManager}) {
  const configDirectory = await makeDir(`${projectRoot}/.husky`);
  await createHook({configDirectory, hookName: 'pre-commit', script: `${packageManager} test`});

  return {devDependencies: ['husky@latest'], scripts: {prepare: 'husky install'}};
}
