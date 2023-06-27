import {fileExists} from '@form8ion/core';

import createHook from '../hook-creator';

export default async function ({projectRoot}) {
  const configDirectory = `${projectRoot}/.husky`;
  const hookName = 'commit-msg';

  const [legacyCommitlintConfigExists, modernCommitlintConfigExists] = await Promise.all([
    fileExists(`${projectRoot}/.commitlintrc.js`),
    fileExists(`${projectRoot}/.commitlintrc.json`)
  ]);

  if (
    (legacyCommitlintConfigExists || modernCommitlintConfigExists)
      && !(await fileExists(`${configDirectory}/${hookName}`))
  ) {
    await createHook({configDirectory, hookName, script: 'npx --no-install commitlint --edit $1'});
  }
}
