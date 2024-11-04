import {directoryExists} from '@form8ion/core';
import {info} from '@travi/cli-messages';

import writeHookFile from './writer.js';

export default async function ({projectRoot, hookName, script}) {
  if (await directoryExists(`${projectRoot}/.husky`)) {
    info(`Defining ${hookName} hook`, {level: 'secondary'});

    await writeHookFile({projectRoot, name: hookName, script});
  }
}
