import makeDir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot}) {
  await makeDir(`${projectRoot}/.husky`);

  return {devDependencies: ['husky']};
}
