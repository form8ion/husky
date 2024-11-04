import {describe, it} from 'vitest';

import liftHook from './lift.js';

describe('hook lifter', () => {
  it('should remove the deprecated lines from the hook file', async () => {
    await liftHook();
  });
});
