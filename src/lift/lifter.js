import {updateConfigToMatchInstalledVersion} from './config';
import configurePrecommitHook from './pre-commit';

export default async function ({projectRoot, packageManager}) {
  const [configFormatResults] = await Promise.all([
    updateConfigToMatchInstalledVersion({projectRoot, packageManager}),
    configurePrecommitHook({projectRoot})
  ]);

  return configFormatResults;
}
