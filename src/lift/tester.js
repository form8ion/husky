import {warn} from '@travi/cli-messages';

import execa from '../../thirdparty-wrappers/execa';

export default async function () {
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
