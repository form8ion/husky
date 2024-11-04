import {promises as fs} from 'node:fs';

export default function ({projectRoot, name, script}) {
  return fs.writeFile(`${projectRoot}/.husky/${name}`, script, {mode: 0o755});
}
