import {promises as fs} from 'node:fs';

import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';

import writeHookFile from './writer.js';

vi.mock('node:fs');

describe('hook script writer', () => {
  it('should write the hook script and make it executable', async () => {
    const projectRoot = any.string();
    const scriptName = any.word();
    const script = any.string();

    await writeHookFile({projectRoot, name: scriptName, script});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.husky/${scriptName}`, script, {mode: 0o755});
  });
});
