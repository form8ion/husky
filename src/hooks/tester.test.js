import {directoryExists} from '@form8ion/core';

import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import modernConfigDirectoryExists from './tester.js';

vi.mock('@form8ion/core');

describe('hooks predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the `.husky/` directory exists', async () => {
    when(directoryExists).calledWith(`${projectRoot}/.husky`).thenResolve(true);

    expect(await modernConfigDirectoryExists({projectRoot})).toBe(true);
  });

  it('should return `false` if the `.husky/` directory does not exist', async () => {
    when(directoryExists).calledWith(`${projectRoot}/.husky`).thenResolve(false);

    expect(await modernConfigDirectoryExists({projectRoot})).toBe(false);
  });
});
