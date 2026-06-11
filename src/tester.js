import {execa} from 'execa';
import {directoryExists} from '@form8ion/core';

export default async function ({projectRoot}, {logger}) {
  if (await directoryExists(`${projectRoot}/.husky`)) return true;

  try {
    await execa('npm', ['ls', 'husky', '--json']);

    return true;
  } catch (e) {
    if ('npm ls husky --json' === e.command) {
      logger.warn('Husky is not currently installed as a dependency');

      return false;
    }

    throw e;
  }
}
