import {updateConfigToMatchInstalledVersion} from './config';

export default async function ({projectRoot, packageManager}) {
  return updateConfigToMatchInstalledVersion({projectRoot, packageManager});
}
