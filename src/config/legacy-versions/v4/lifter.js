import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';

import scaffold from '../../../scaffolder.js';

export default async function ({projectRoot, packageManager}) {
  info('Lifting from v3 format of Husky config', {level: 'secondary'});

  await fs.unlink(`${projectRoot}/.huskyrc.json`);

  return scaffold({projectRoot, packageManager});
}
