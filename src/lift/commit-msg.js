import {fileExists} from '@form8ion/core';

import createHook from '../hook-creator';

async function commitlintConfigExists(projectRoot) {
  const [legacyCommitlintConfigExists, modernCommitlintConfigExists] = await Promise.all([
    fileExists(`${projectRoot}/.commitlintrc.js`),
    fileExists(`${projectRoot}/.commitlintrc.json`)
  ]);

  return legacyCommitlintConfigExists || modernCommitlintConfigExists;
}

async function commitMsgHookNotAlreadyDefined(configDirectory) {
  return !(await fileExists(`${configDirectory}/commit-msg`));
}

export default async function ({projectRoot}) {
  const configDirectory = `${projectRoot}/.husky`;

  if (await commitlintConfigExists(projectRoot) && await commitMsgHookNotAlreadyDefined(configDirectory)) {
    await createHook({configDirectory, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'});
  }
}
