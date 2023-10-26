import {updateConfigToMatchInstalledVersion} from './config.js';
import configureCommitMsgHook from './commit-msg.js';

export default async function ({projectRoot, packageManager}) {
  const configFormatResults = await updateConfigToMatchInstalledVersion({projectRoot, packageManager});

  await configureCommitMsgHook({projectRoot});

  return configFormatResults;
}
