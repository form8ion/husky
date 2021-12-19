import {updateConfigToMatchInstalledVersion} from './config';
import configureCommitMsgHook from './commit-msg';

export default async function ({projectRoot, packageManager}) {
  const configFormatResults = await updateConfigToMatchInstalledVersion({projectRoot, packageManager});

  await configureCommitMsgHook({projectRoot});

  return configFormatResults;
}
