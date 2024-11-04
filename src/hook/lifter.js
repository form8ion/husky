import readHookFile from './reader.js';
import writeHookFile from './writer.js';

export default async function ({projectRoot, name}) {
  const hookContents = await readHookFile({projectRoot, name});

  const contentsWithDeprecatedLinesRemoved = hookContents.replace(
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

`,
    ''
  );

  return writeHookFile({projectRoot, name, script: contentsWithDeprecatedLinesRemoved});
}
