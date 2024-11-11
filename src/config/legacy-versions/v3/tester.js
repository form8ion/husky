import {promises as fs} from 'node:fs';

export default async function ({projectRoot}) {
  const packageFilePath = `${projectRoot}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(packageFilePath, 'utf-8'));
  const {precommit, commitmsg} = packageContents.scripts;

  return !!(precommit || commitmsg);
}
