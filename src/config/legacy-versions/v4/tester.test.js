import {fileExists} from '@form8ion/core';

import any from '@travi/any';
import {describe, vi, expect, it} from 'vitest';
import {when} from 'jest-when';

import huskyRcFileExists from './tester.js';

vi.mock('@form8ion/core');

describe('v4 config predicate', () => {
  const projectRoot = any.string();

  it('should return `false` when a `.huskyrc.json` file does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/.huskyrc.json`).mockResolvedValue(false);

    expect(await huskyRcFileExists({projectRoot})).toBe(false);
  });

  it('should return `true` when a `.huskyrc.json` file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.huskyrc.json`).mockResolvedValue(true);

    expect(await huskyRcFileExists({projectRoot})).toBe(true);
  });
});
