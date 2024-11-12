import {loadPackageJson, writePackageJson} from '@form8ion/javascript-core';

import scaffold from '../../../scaffold/scaffolder.js';

async function removeHuskyNpmScripts(projectRoot) {
  const packageContents = await loadPackageJson({projectRoot});
  const {precommit, commitmsg, ...otherScripts} = packageContents.scripts;

  await writePackageJson({projectRoot, config: {...packageContents, scripts: otherScripts}});
}

export default async function ({projectRoot, packageManager}) {
  await removeHuskyNpmScripts(projectRoot);

  return scaffold({projectRoot, packageManager});
}
