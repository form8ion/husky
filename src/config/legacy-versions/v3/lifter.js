import {loadPackageJson, writePackageJson} from '@form8ion/javascript-core';
import {info} from '@travi/cli-messages';

import scaffold from '../../../scaffold/scaffolder.js';

async function removeHuskyNpmScripts(projectRoot) {
  const packageContents = await loadPackageJson({projectRoot});
  const {precommit, commitmsg, ...otherScripts} = packageContents.scripts;

  await writePackageJson({projectRoot, config: {...packageContents, scripts: otherScripts}});
}

export default async function ({projectRoot, packageManager}) {
  info('Lifting from v3 format of Husky config', {level: 'secondary'});

  await removeHuskyNpmScripts(projectRoot);

  return scaffold({projectRoot, packageManager});
}
