import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  runTasksInSerial,
} from '@nx/devkit';
import * as path from 'path';
import { CreateProbotAppGeneratorSchema } from './schema';
import { DepTree } from './package-and-version';

export async function createProbotAppGenerator(
  tree: Tree,
  options: CreateProbotAppGeneratorSchema
): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];
  const projectRoot = `apps/${options.name}`;

  const depsToInstall: DepTree = {
    dependencies: {
      'probot': '^12.2.4',
      'typescript': '^4.1.3',
    },
    devDependencies: {
      "@types/jest": "^29.0.0",
      "@types/node": "^18.0.0",
      "jest": "^29.0.0",
      "nock": "^13.0.5",
      "smee-client": "^1.2.2",
      "ts-jest": "^29.0.0"
    }
  };

  if (!tree) {
    throw 'Tree shouldn\'t be null or undefined';
  }
  
  tasks.push(
    addDependenciesToPackageJson(tree, depsToInstall.dependencies, depsToInstall.peerDependencies)
  );

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  // Update package.json here
  await formatFiles(tree);

  tasks.push(() => {
    installPackagesTask(tree);
  });

  return runTasksInSerial(...tasks);
}

export default createProbotAppGenerator;

// npx create-nx-workspace
// nx generate @mintplayer/nx-generators:create-probot-app