import {promises as fs} from 'node:fs';

import {it, describe, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import readHookFile from './reader.js';

vi.mock('node:fs');

describe('hook script reader', () => {
  it('should read the named hook script', async () => {
    const projectRoot = any.string();
    const name = any.word();
    const script = any.string();
    when(fs.readFile).calledWith(`${projectRoot}/.husky/${name}`, 'utf8').thenResolve(script);

    expect(await readHookFile({projectRoot, name})).toEqual(script);
  });
});
