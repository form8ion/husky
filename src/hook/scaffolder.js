import {info} from '@travi/cli-messages';

import modernConfigExists from '../hooks/tester.js';
import writeHookFile from './writer.js';

export default async function ({projectRoot, hookName, script}) {
  if (await modernConfigExists({projectRoot})) {
    info(`Defining ${hookName} hook`, {level: 'secondary'});

    await writeHookFile({projectRoot, name: hookName, script});
  }
}
