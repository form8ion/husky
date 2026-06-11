import {promises as fs} from 'node:fs';

import scaffold from '../../../scaffolder.js';

export default async function ({projectRoot, packageManager}, dependencies) {
  const {logger} = dependencies;

  logger.info('Lifting from v3 format of Husky config', {level: 'secondary'});

  await fs.unlink(`${projectRoot}/.huskyrc.json`);

  return scaffold({projectRoot, packageManager}, dependencies);
}
