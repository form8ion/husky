import any from '@travi/any';
import {describe, it, vi, expect} from 'vitest';

import {scaffold as createHook} from '../hook/index.js';
import scaffoldPreCommitHook from './scaffolder.js';

vi.mock('../hook/index.js');

describe('pre-commit scaffolder', () => {
  it('should create the hook file in the `.husky/` directory', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();

    await scaffoldPreCommitHook({projectRoot, packageManager});

    expect(createHook).toHaveBeenCalledWith({projectRoot, hookName: 'pre-commit', script: `${packageManager} test`});
  });
});
