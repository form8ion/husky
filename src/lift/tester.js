import {warn} from '@travi/cli-messages';
import {directoryExists} from '@form8ion/core';

import execa from '../../thirdparty-wrappers/execa.js';

export default async function ({projectRoot}) {
  if (await directoryExists(`${projectRoot}/.husky`)) return true;

  try {
    await execa('npm', ['ls', 'husky', '--json']);

    return true;
  } catch (e) {
    if ('npm ls husky --json' === e.command) {
      warn('Husky is not currently installed as a dependency');

      return false;
    }

    throw e;
  }
}
