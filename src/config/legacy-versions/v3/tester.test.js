import {loadPackageJson} from '@form8ion/javascript-core';

import any from '@travi/any';
import {describe, vi, expect, it} from 'vitest';
import {when} from 'jest-when';

import huskyScriptsExistAsNpmScripts from './tester.js';

vi.mock('@form8ion/javascript-core');

describe('v3 config predicate', () => {
  const projectRoot = any.string();

  it('should return `false` when husky scripts do not exist as npm scripts', async () => {
    const packageContents = {...any.simpleObject(), scripts: any.simpleObject()};
    when(loadPackageJson).calledWith({projectRoot}).mockResolvedValue(packageContents);

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(false);
  });

  it('should return `true` when a precommit script exists as an npm script', async () => {
    const packageContents = {...any.simpleObject(), scripts: {precommit: any.string()}};
    when(loadPackageJson).calledWith({projectRoot}).mockResolvedValue(packageContents);

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(true);
  });

  it('should return `true` when a commitmsg script exists as an npm script', async () => {
    const packageContents = {...any.simpleObject(), scripts: {commitmsg: any.string()}};
    when(loadPackageJson).calledWith({projectRoot}).mockResolvedValue(packageContents);

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(true);
  });
});
