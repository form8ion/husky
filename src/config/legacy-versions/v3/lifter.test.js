import {loadPackageJson, writePackageJson} from '@form8ion/javascript-core';

import any from '@travi/any';
import {describe, vi, expect, it} from 'vitest';
import {when} from 'jest-when';

import scaffold from '../../../scaffold/scaffolder.js';
import liftV3Config from './lifter.js';

vi.mock('@form8ion/javascript-core');
vi.mock('../../../scaffold/scaffolder.js');

describe('v3 config lifter', () => {
  it('should create modern config and remove the legacy npm scripts', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();
    const scaffoldResults = any.simpleObject();
    const otherScripts = any.simpleObject();
    const otherPackageContents = any.simpleObject();
    const existingPackageContents = {
      ...otherPackageContents,
      scripts: {...otherScripts, precommit: any.string(), commitmsg: any.string()}
    };
    when(loadPackageJson).calledWith({projectRoot}).mockResolvedValue(existingPackageContents);
    when(scaffold).calledWith({projectRoot, packageManager}).mockResolvedValue(scaffoldResults);

    expect(await liftV3Config({projectRoot, packageManager})).toEqual(scaffoldResults);

    expect(writePackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {scripts: otherScripts, ...otherPackageContents}
    });
  });
});
