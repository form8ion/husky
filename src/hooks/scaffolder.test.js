import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {describe, it, vi, expect} from 'vitest';

import scaffoldHuskyDirectory from './scaffolder.js';

vi.mock('node:fs');

describe('config scaffolder', () => {
  it('should create the `.husky` directory', async () => {
    const projectRoot = any.string();

    await scaffoldHuskyDirectory({projectRoot});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.husky`);
  });
});
