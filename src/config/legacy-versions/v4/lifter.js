import {promises as fs} from 'node:fs';

import scaffold from '../../../scaffold/scaffolder.js';

export default async function ({projectRoot, packageManager}) {
  await fs.unlink(`${projectRoot}/.huskyrc.json`);

  return scaffold({projectRoot, packageManager});
}
