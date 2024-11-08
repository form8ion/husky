import {promises as fs} from 'node:fs';
import {lift as liftHook} from '../hook/index.js';

export default async function ({projectRoot}) {
  const hooks = await fs.readdir(`${projectRoot}/.husky`, {withFileTypes: true});

  const promises = hooks
    .filter(hook => hook.isFile())
    .map(({name}) => liftHook({projectRoot, name}));
  return Promise.all(promises);
}
