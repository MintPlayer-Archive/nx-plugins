import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  installPackagesTask,
} from '@nx/devkit';
import * as path from 'path';
import { CreateProbotAppGeneratorSchema } from './schema';

export async function createProbotAppGenerator(
  tree: Tree,
  options: CreateProbotAppGeneratorSchema
) {
  const projectRoot = `apps/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
  
  return () => {
    installPackagesTask(tree);
  };
}

export default createProbotAppGenerator;

// npx create-nx-workspace
// nx generate @mintplayer/nx-generators:create-probot-app