import {loadPackageJson} from '@form8ion/javascript-core';

export default async function ({projectRoot}) {
  const {scripts: {precommit, commitmsg}} = await loadPackageJson({projectRoot});

  return !!(precommit || commitmsg);
}
