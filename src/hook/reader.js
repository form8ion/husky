import {promises as fs} from 'node:fs';

export default function ({projectRoot, name}) {
  return fs.readFile(`${projectRoot}/.husky/${name}`, 'utf8');
}
