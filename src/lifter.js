import {promises as fs} from 'fs';
import semver from 'semver';
import {info, warn} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';
import execa from '../thirdparty-wrappers/execa';
import scaffold from './scaffolder';

export default async function ({projectRoot, packageManager}) {
  const huskyV4ConfigExists = await fileExists(`${projectRoot}/.huskyrc.json`);

  try {
    const {stdout: huskyVersionDetails} = await execa('npm', ['ls', 'husky', '--json']);

    const {dependencies} = JSON.parse(huskyVersionDetails);

    if (semver.gte(dependencies.husky.version, '5.0.0') && huskyV4ConfigExists) {
      const outdatedConfigMessage = 'Husky configuration is outdated for the installed Husky version';

      info(outdatedConfigMessage, {level: 'secondary'});

      const [results] = await Promise.all([
        scaffold({projectRoot, packageManager}),
        fs.unlink(`${projectRoot}/.huskyrc.json`)
      ]);

      return results;
    }

    return {};
  } catch (e) {
    if ('npm ls husky --json' === e.command) {
      warn('Husky is not currently installed as a dependency');

      return {};
    }

    throw e;
  }
}
