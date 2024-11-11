import {exists} from '@form8ion/config-file';

import {vi, describe, it, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as createHook} from '../hook/index.js';
import commitMsgHookAlreadyDefined from './tester.js';
import scaffoldCommitMsgHook from './scaffolder.js';

vi.mock('@form8ion/config-file');
vi.mock('../hook/index.js');
vi.mock('./tester.js');

describe('commit-msg hook scaffolder', () => {
  const projectRoot = any.string();

  it('should create the hook file in the `.husky/` directory', async () => {
    when(exists).calledWith({name: 'commitlint'}).mockResolvedValue(true);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).toHaveBeenCalledWith({
      projectRoot,
      hookName: 'commit-msg',
      script: 'npx --no-install commitlint --edit $1'
    });
  });

  it('should not create the hook file if commitlint is not configured', async () => {
    when(exists).calledWith({name: 'commitlint'}).mockResolvedValue(false);
    when(commitMsgHookAlreadyDefined).calledWith({projectRoot}).mockResolvedValue(false);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).not.toHaveBeenCalled();
  });

  it('should not create the hook file if it already exists', async () => {
    when(exists).calledWith({name: 'commitlint'}).mockResolvedValue(true);
    when(commitMsgHookAlreadyDefined).calledWith({projectRoot}).mockResolvedValue(true);

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).not.toHaveBeenCalled();
  });
});
