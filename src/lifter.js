import {updateConfigToMatchInstalledVersion} from './lift/update-config';

export default async function ({projectRoot, packageManager}) {
  return updateConfigToMatchInstalledVersion(projectRoot, packageManager);
}
