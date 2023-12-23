import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { CreateProbotAppGeneratorSchema } from './schema';

export async function createProbotAppGenerator(
  tree: Tree,
  options: CreateProbotAppGeneratorSchema
) {
  const projectRoot = `libs/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default createProbotAppGenerator;

// nx generate @mintplayer/nx-generators:create-probot-app