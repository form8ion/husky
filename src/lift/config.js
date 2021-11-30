import {promises as fs} from 'fs';
import semver from 'semver';
import {info} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';
import execa from '../../thirdparty-wrappers/execa';
import scaffold from '../scaffolder';

function v3ConfigExists(precommit, commitmsg) {
  return precommit || commitmsg;
}

function legacyConfigExists(v3Exists, v4ConfigExists) {
  return v3Exists || v4ConfigExists;
}

function configFormatShouldBeUpdated(version, v3Exists, huskyV4ConfigExists) {
  return semver.gte(version, '5.0.0') && legacyConfigExists(v3Exists, huskyV4ConfigExists);
}

export async function updateConfigToMatchInstalledVersion({projectRoot, packageManager}) {
  const packageFilePath = `${projectRoot}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(packageFilePath, 'utf-8'));
  const {precommit, commitmsg, ...otherScripts} = packageContents.scripts;
  const v3Exists = v3ConfigExists(precommit, commitmsg);
  const huskyV4ConfigExists = await fileExists(`${projectRoot}/.huskyrc.json`);

  const {stdout: huskyVersionDetails} = await execa('npm', ['ls', 'husky', '--json']);

  const {dependencies} = JSON.parse(huskyVersionDetails);

  if (configFormatShouldBeUpdated(dependencies.husky.version, v3Exists, huskyV4ConfigExists)) {
    const outdatedConfigMessage = 'Husky configuration is outdated for the installed Husky version';

    info(outdatedConfigMessage, {level: 'secondary'});

    const [results] = await Promise.all([
      scaffold({projectRoot, packageManager}),
      v3Exists
        ? fs.writeFile(packageFilePath, JSON.stringify({
          ...packageContents,
          scripts: {...otherScripts}
        }))
        : Promise.resolve(),
      huskyV4ConfigExists ? fs.unlink(`${projectRoot}/.huskyrc.json`) : Promise.resolve()
    ]);

    return results;
  }

  return {};
}
