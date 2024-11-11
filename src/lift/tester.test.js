import any from '@travi/any';
import {describe, it, vi, expect} from 'vitest';
import {when} from 'jest-when';

import execa from '../../thirdparty-wrappers/execa.js';
import predicate from './tester.js';

vi.mock('../../thirdparty-wrappers/execa.js');

describe('lift predicate', () => {
  const projectRoot = any.string();

  it('should return `false` when the project is not using husky', async () => {
    const error = Object.assign(
      new Error('Command failed with exit code 1: npm ls husky --json'),
      {command: 'npm ls husky --json'}
    );
    when(execa).calledWith('npm', ['ls', 'husky', '--json']).mockRejectedValue(error);

    expect(await predicate({projectRoot})).toBe(false);
  });

  it('should return `true` when the modern config directory exists', async () => {
    when(execa)
      .calledWith('npm', ['ls', 'husky', '--json'])
      .mockResolvedValue({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});

    expect(await predicate({projectRoot})).toBe(true);
  });

  it('should throw other errors from checking the husky installation', async () => {
    const message = any.sentence();
    when(execa).calledWith('npm', ['ls', 'husky', '--json']).mockRejectedValue(new Error(message));

    await expect(predicate({projectRoot})).rejects.toThrow(message);
  });
});
