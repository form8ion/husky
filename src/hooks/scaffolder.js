import {promises as fs} from 'node:fs';

export default function ({projectRoot}) {
  return fs.mkdir(`${projectRoot}/.husky`);
}
