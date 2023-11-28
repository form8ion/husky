import {promises as fs} from 'node:fs';
import {directoryExists} from '@form8ion/core';
import {info} from '@travi/cli-messages';

export default async function ({configDirectory, hookName, script}) {
  if (await directoryExists(configDirectory)) {
    info(`Defining ${hookName} hook`, {level: 'secondary'});

    await fs.writeFile(
      `${configDirectory}/${hookName}`,
      `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

${script}`,
      {mode: 0o755}
    );
  }
}
