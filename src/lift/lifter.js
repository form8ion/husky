import {updateConfigToMatchInstalledVersion} from './update-config';

export default async function ({projectRoot, packageManager}) {
  return updateConfigToMatchInstalledVersion(projectRoot, packageManager);
}
