import {updateConfigToMatchInstalledVersion} from './config';
import configurePrecommitHook from './pre-commit';

export default async function ({projectRoot, packageManager}) {
  const configFormatResults = await updateConfigToMatchInstalledVersion({projectRoot, packageManager});

  await configurePrecommitHook({projectRoot});

  return configFormatResults;
}
