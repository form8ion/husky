import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import readHookFile from './reader.js';
import writeHookFile from './writer.js';
import liftHook from './lifter.js';

vi.mock('./reader.js');
vi.mock('./writer.js');
describe('hook script lifter', () => {
  const projectRoot = any.string();
  const name = any.word();
  const hookContents = any.string();

  it('should lift a hook script', async () => {
    const deprecatedLines = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

`;
    when(readHookFile).calledWith({projectRoot, name}).thenResolve(`${deprecatedLines}${hookContents}`);

    await liftHook({projectRoot, name});

    expect(writeHookFile).toHaveBeenCalledWith({projectRoot, name, script: hookContents});
  });

  it('should not write the file if the contents are unchanged', async () => {
    when(readHookFile).calledWith({projectRoot, name}).thenResolve(hookContents);

    await liftHook({projectRoot, name});

    expect(writeHookFile).not.toHaveBeenCalled();
  });
});
