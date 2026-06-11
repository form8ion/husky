import any from '@travi/any';
import {describe, vi, it, expect} from 'vitest';

import {scaffold as scaffoldHuskyDirectory} from './hooks/index.js';
import {scaffold as createPrecommitHook} from './pre-commit/index.js';
import scaffold from './scaffolder.js';

vi.mock('./hooks/index.js');
vi.mock('./pre-commit/index.js');

describe('scaffolder', () => {
  const projectRoot = any.string();
  const packageManager = any.word();
  const injectedDependencies = {...any.simpleObject(), logger: {info: () => undefined}};

  it('should configure husky for the project', async () => {
    const {dependencies, scripts} = await scaffold({projectRoot, packageManager}, injectedDependencies);

    expect(scaffoldHuskyDirectory).toHaveBeenCalledWith({projectRoot});
    expect(createPrecommitHook).toHaveBeenCalledWith({projectRoot, packageManager}, injectedDependencies);

    expect(dependencies.javascript.development).toEqual(['husky@latest']);
    expect(scripts).toEqual({prepare: 'husky'});
  });

  it('should not apply configuration if the project is being scaffolded as a sub-project', async () => {
    const {devDependencies, scripts} = await scaffold(
      {projectRoot, packageManager, pathWithinParent: any.string()},
      injectedDependencies
    );

    expect(devDependencies).toBeUndefined();
    expect(scripts).toBeUndefined();

    expect(scaffoldHuskyDirectory).not.toHaveBeenCalled();
    expect(createPrecommitHook).not.toHaveBeenCalled();
  });
});
