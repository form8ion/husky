import {applyEnhancers} from '@form8ion/core';

import any from '@travi/any';
import {it, describe, vi, expect} from 'vitest';
import {when} from 'vitest-when';

import * as v3ConfigPlugin from './legacy-versions/v3/index.js';
import * as v4ConfigPlugin from './legacy-versions/v4/index.js';
import liftConfig from './lifter.js';

vi.mock('@form8ion/core');

describe('config lifter', () => {
  it('should lift legacy config formats to the modern format', async () => {
    const projectRoot = any.string();
    const packageManager = any.word();
    const enhancerResults = any.simpleObject();
    when(applyEnhancers)
      .calledWith({
        options: {projectRoot, packageManager},
        enhancers: {v3Config: v3ConfigPlugin, v4Config: v4ConfigPlugin}
      })
      .thenResolve(enhancerResults);

    expect(await liftConfig({projectRoot, packageManager})).toEqual(enhancerResults);
  });
});
