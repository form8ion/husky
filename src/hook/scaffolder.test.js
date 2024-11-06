import {it, vi, describe, expect} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import modernConfigExists from '../hooks/tester.js';
import writeHookFile from './writer.js';
import createHook from './scaffolder.js';

vi.mock('../hooks/tester.js');
vi.mock('./writer.js');

describe('hook creator', () => {
  const projectRoot = any.string();
  const hookName = any.word();
  const script = any.string();

  it('should create a hook file', async () => {
    when(modernConfigExists).calledWith({projectRoot}).mockResolvedValue(true);

    await createHook({projectRoot, hookName, script});

    expect(writeHookFile).toHaveBeenCalledWith({projectRoot, name: hookName, script});
  });

  it('should not create the hook file if the config directory does not exist', async () => {
    when(modernConfigExists).mockResolvedValue(false);

    await createHook({projectRoot, hookName, script});

    expect(writeHookFile).not.toHaveBeenCalled();
  });
});
