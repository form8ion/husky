import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import readHookFile from './reader.js';
import writeHookFile from './writer.js';
import liftHook from './lifter.js';

vi.mock('./reader.js');
vi.mock('./writer.js');
describe('hook script lifter', () => {
  it('should lift a hook script', async () => {
    const projectRoot = any.string();
    const name = any.word();
    const deprecatedLines = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

`;
    const hookContents = any.string();
    when(readHookFile).calledWith({projectRoot, name}).mockResolvedValue(`${deprecatedLines}${hookContents}`);

    await liftHook({projectRoot, name});

    expect(writeHookFile).toHaveBeenCalledWith({projectRoot, name, script: hookContents});
  });
});
