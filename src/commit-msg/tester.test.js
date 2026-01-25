import {fileExists} from '@form8ion/core';

import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';

import commitMsgHookExists from './tester.js';

vi.mock('@form8ion/core');

describe('commit-msg predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the hook file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.husky/commit-msg`).thenResolve(true);

    expect(await commitMsgHookExists({projectRoot})).toBe(true);
  });

  it('should return `false` if the hook file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.husky/commit-msg`).thenResolve(false);

    expect(await commitMsgHookExists({projectRoot})).toBe(false);
  });
});
