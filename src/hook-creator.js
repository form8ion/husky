import {promises as fs} from 'fs';

export default async function ({configDirectory, hookName, script}) {
  await fs.writeFile(
    `${configDirectory}/${hookName}`,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

${script}`,
    {mode: 0o755}
  );
}
