import modernConfigExists from '../hooks/tester.js';
import writeHookFile from './writer.js';

export default async function ({projectRoot, hookName, script}, {logger}) {
  if (await modernConfigExists({projectRoot})) {
    logger.info(`Defining ${hookName} hook`, {level: 'secondary'});

    await writeHookFile({projectRoot, name: hookName, script});
  }
}
