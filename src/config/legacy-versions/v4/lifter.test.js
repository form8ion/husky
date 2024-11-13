import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {describe, vi, expect, it} from 'vitest';
import {when} from 'jest-when';

import scaffold from '../../../scaffold/scaffolder.js';
import liftV4Config from './lifter.js';

vi.mock('node:fs');
vi.mock('../../../scaffold/scaffolder.js');

describe('v4 config lifter', () => {
  it('should create modern config and remove the legacy rc file', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();
    const scaffoldResults = any.simpleObject();
    when(scaffold).calledWith({projectRoot, packageManager}).mockResolvedValue(scaffoldResults);

    expect(await liftV4Config({projectRoot, packageManager})).toEqual(scaffoldResults);

    expect(fs.unlink).toHaveBeenCalledWith(`${projectRoot}/.huskyrc.json`);
  });
});
