import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {describe, vi, expect, it} from 'vitest';
import {when} from 'jest-when';

import huskyScriptsExistAsNpmScripts from './tester.js';

vi.mock('node:fs');

describe('v3 config predicate', () => {
  const projectRoot = any.string();

  it('should return `false` when husky scripts do not exist as npm scripts', async () => {
    const packageContents = {...any.simpleObject(), scripts: any.simpleObject()};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageContents));

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(false);
  });

  it('should return `true` when a precommit script exists as an npm script', async () => {
    const packageContents = {...any.simpleObject(), scripts: {precommit: any.string()}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageContents));

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(true);
  });

  it('should return `true` when a commitmsg script exists as an npm script', async () => {
    const packageContents = {...any.simpleObject(), scripts: {commitmsg: any.string()}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageContents));

    expect(await huskyScriptsExistAsNpmScripts({projectRoot})).toBe(true);
  });
});
