import {exists} from '@form8ion/config-file';

import {vi, describe, it, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {scaffold as createHook} from '../hook/index.js';
import commitMsgHookAlreadyDefined from './tester.js';
import scaffoldCommitMsgHook from './scaffolder.js';

vi.mock('@form8ion/config-file');
vi.mock('../hook/index.js');
vi.mock('./tester.js');

describe('commit-msg hook scaffolder', () => {
  const projectRoot = any.string();

  it('should create the hook file in the `.husky/` directory', async () => {
    when(exists).calledWith({name: 'commitlint'}).thenResolve(true);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).toHaveBeenCalledWith({
      projectRoot,
      hookName: 'commit-msg',
      script: 'npx --no-install commitlint --edit $1'
    });
  });

  it('should not create the hook file if commitlint is not configured', async () => {
    when(exists).calledWith({name: 'commitlint'}).thenResolve(false);
    when(commitMsgHookAlreadyDefined).calledWith({projectRoot}).thenResolve(false);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).not.toHaveBeenCalled();
  });

  it('should not create the hook file if it already exists', async () => {
    when(exists).calledWith({name: 'commitlint'}).thenResolve(true);
    when(commitMsgHookAlreadyDefined).calledWith({projectRoot}).thenResolve(true);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).not.toHaveBeenCalled();
  });
});
