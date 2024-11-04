import {promises as fs} from 'node:fs';

import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift as liftHook} from '../hook/index.js';
import liftHooks from './lifter.js';

vi.mock('node:fs');
vi.mock('../hook/index.js');

describe('hooks lifter', () => {
  it('should lift all of the hooks in the directory', async () => {
    const projectRoot = any.string();
    const hookNames = any.listOf(any.word);
    when(fs.readdir).calledWith(`${projectRoot}/.husky`).mockResolvedValue(hookNames);

    await liftHooks({projectRoot});

    hookNames.forEach(name => expect(liftHook).toHaveBeenCalledWith({projectRoot, name}));
  });
});
