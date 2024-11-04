import {promises as fs} from 'node:fs';
import semver from 'semver';
import {info} from '@travi/cli-messages';
import {directoryExists, fileExists} from '@form8ion/core';

import execa from '../../thirdparty-wrappers/execa.js';
import scaffold from '../scaffold/scaffolder.js';

function v3ConfigExists(precommit, commitmsg) {
  return precommit || commitmsg;
}

function legacyConfigExists(v3Exists, v4ConfigExists) {
  return v3Exists || v4ConfigExists;
}

async function configFormatShouldBeUpdated(projectRoot, v3Exists, huskyV4ConfigExists) {
  if (await directoryExists(`${projectRoot}/.husky`)) return false;

  const {stdout: huskyVersionDetails} = await execa('npm', ['ls', 'husky', '--json']);

  const {dependencies} = JSON.parse(huskyVersionDetails);

  return semver.gte(dependencies.husky.version, '5.0.0') && legacyConfigExists(v3Exists, huskyV4ConfigExists);
}

async function updateOutdatedConfigFormat(
  projectRoot,
  packageManager,
  v3Exists,
  packageFilePath,
  packageContents,
  otherScripts,
  huskyV4ConfigExists
) {
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

export async function updateConfigToMatchInstalledVersion({projectRoot, packageManager}) {
  const packageFilePath = `${projectRoot}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(packageFilePath, 'utf-8'));
  const {precommit, commitmsg, ...otherScripts} = packageContents.scripts;
  const v3Exists = v3ConfigExists(precommit, commitmsg);
  const huskyV4ConfigExists = await fileExists(`${projectRoot}/.huskyrc.json`);

  if (await configFormatShouldBeUpdated(projectRoot, v3Exists, huskyV4ConfigExists)) {
    info('Updating Husky config format', {level: 'secondary'});

    return updateOutdatedConfigFormat(
      projectRoot,
      packageManager,
      v3Exists,
      packageFilePath,
      packageContents,
      otherScripts,
      huskyV4ConfigExists
    );
  }

  return {};
}
