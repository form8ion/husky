import deepmerge from 'deepmerge';

import any from '@travi/any';
import {it, expect, vi, describe} from 'vitest';
import {when} from 'vitest-when';

import {lift as liftConfig} from './config/index.js';
import {scaffold as configureCommitMsgHook} from './commit-msg/index.js';
import {lift as liftHooks, test as modernConfigIsUsed} from './hooks/index.js';
import lift from './lifter.js';

vi.mock('deepmerge');
vi.mock('./config/index.js');
vi.mock('./commit-msg/index.js');
vi.mock('./hooks/index.js');

describe('lifter', () => {
  const projectRoot = any.string();
  const packageManager = any.word();

  it('should update the husky config to match the installed version', async () => {
    const configFormatResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(liftConfig).calledWith({projectRoot, packageManager}).thenResolve(configFormatResults);
    when(modernConfigIsUsed).calledWith({projectRoot}).thenResolve(true);
    when(deepmerge).calledWith(configFormatResults, {scripts: {prepare: 'husky'}}).thenReturn(mergedResults);

    expect(await lift({projectRoot, packageManager})).toEqual(mergedResults);

    expect(configureCommitMsgHook).toHaveBeenCalledWith({projectRoot});
    expect(liftHooks).toHaveBeenCalledWith({projectRoot});
  });

  it('should not update the hooks when the modern config is not yet in place', async () => {
    when(modernConfigIsUsed).calledWith({projectRoot}).thenResolve(false);

    await lift({projectRoot, packageManager});

    expect(configureCommitMsgHook).not.toHaveBeenCalled();
    expect(liftHooks).not.toHaveBeenCalled();
  });
});
