import {promises as fs} from 'node:fs';
import {lift as liftHook} from '../hook/index.js';

export default async function ({projectRoot}) {
  const hooks = await fs.readdir(`${projectRoot}/.husky`);

  return Promise.all(hooks.map(hook => liftHook({projectRoot, name: hook})));
}
