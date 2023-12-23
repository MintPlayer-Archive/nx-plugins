import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { createProbotAppGenerator } from './generator';
import { CreateProbotAppGeneratorSchema } from './schema';

describe('create-probot-app generator', () => {
  let tree: Tree;
  const options: CreateProbotAppGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createProbotAppGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
