import {fileExists} from '@form8ion/core';

import {scaffold as createHook, test as commitMsgHookAlreadyDefined} from '../commit-msg/index.js';

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

export default async function ({projectRoot}) {
  if (await commitlintConfigExists(projectRoot) && !(await commitMsgHookAlreadyDefined({projectRoot}))) {
    await createHook({projectRoot});
  }
}
