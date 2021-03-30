import makeDir from '../thirdparty-wrappers/make-dir';
import createHook from './hook-creator';

export default async function ({projectRoot}) {
  const configDirectory = await makeDir(`${projectRoot}/.husky`);
  await createHook({configDirectory, hookName: 'pre-commit', script: 'npm test'});

  return {devDependencies: ['husky']};
}
