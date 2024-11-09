import {vi, describe, it, expect} from 'vitest';
import any from '@travi/any';

import {scaffold as createHook} from '../hook/index.js';
import scaffoldCommitMsgHook from './scaffolder.js';

vi.mock('../hook/index.js');

describe('commit-msg hook scaffolder', () => {
  it('should create the hook file in the `.husky/` directory', async () => {
    const projectRoot = any.string();

    await scaffoldCommitMsgHook({projectRoot});

    expect(createHook).toHaveBeenCalledWith({
      projectRoot,
      hookName: 'commit-msg',
      script: 'npx --no-install commitlint --edit $1'
    });
  });
});
