import {fileExists} from '@form8ion/core';

import {scaffold as createHook} from '../hook/index.js';

/**
  this duplicates
    https://github.com/form8ion/commit-convention/blob/25964ddbfb3470f1e54452c9b8b9dc4320df8332/src/commitlint/tester.js
  TODO: it would be better to use ^^ directly in the future
 */
async function commitlintConfigExists(projectRoot) {
  return ['json', 'js', 'cjs']
    .reduce(
      async (acc, extension) => await acc || fileExists(`${projectRoot}/.commitlintrc.${extension}`),
      false
    );
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
