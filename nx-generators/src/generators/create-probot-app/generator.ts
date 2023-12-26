import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  runTasksInSerial,
  updateJson,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
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

  updateJson(tree, 'package.json', (pkgJson) => {
    pkgJson.scripts = {
      ...pkgJson.scripts,
      start: 'nx serve',
      build: 'nx build',
      test: 'nx test'
    }
    return pkgJson;
  });

  tasks.push(
    addDependenciesToPackageJson(tree, depsToInstall.dependencies, depsToInstall.devDependencies),
  );

  // const basePath = 'tsconfig.base.json';
  // if (!tree.exists(basePath)) {
  //   tree.write(basePath, '{}');
  // }
  // updateJson(tree, basePath, (tsconfigBaseJson) => {
  //   tsconfigBaseJson.compileOnSave ??= false;
  //   tsconfigBaseJson.compilerOptions ??= {};
  //   tsconfigBaseJson.compilerOptions.rootDir ??= '.';
  //   tsconfigBaseJson.compilerOptions.sourceMap ??= true;
  //   tsconfigBaseJson.compilerOptions.declaration ??= false;
  //   tsconfigBaseJson.compilerOptions.moduleResolution ??= 'node';
  //   tsconfigBaseJson.compilerOptions.emitDecoratorMetadata ??= true;
  //   tsconfigBaseJson.compilerOptions.experimentalDecorators ??= true;
  //   tsconfigBaseJson.compilerOptions.importHelpers ??= true;
  //   tsconfigBaseJson.compilerOptions.target ??= 'es2015';
  //   tsconfigBaseJson.compilerOptions.module ??= 'esnext';
  //   tsconfigBaseJson.compilerOptions.lib ??= ["es2020", "dom"];
  //   tsconfigBaseJson.compilerOptions.skipLibCheck ??= true;
  //   tsconfigBaseJson.compilerOptions.skipDefaultLibCheck ??= true;
  //   tsconfigBaseJson.compilerOptions.baseUrl ??= '.';
  //   tsconfigBaseJson.compilerOptions.paths ??= {};
  //   tsconfigBaseJson.exclude ??= ["node_modules", "tmp"];

  //   return tsconfigBaseJson;
  // });

  // Generate tsconfig.base.json
  const jsTask = await jsInitGenerator(tree, {
    ...options,
    tsConfigName: 'tsconfig.base.json',
    js: false,
    skipFormat: true,
  });
  tasks.push(jsTask);

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        command: `npx tsc -p ./${projectRoot}/tsconfig.json --outDir ./dist/${projectRoot}`
      },
      serve: {
        command: `probot run ./dist/${projectRoot}/index.js`,
        dependsOn: ['build']
      },
      test: {
        command: 'jest'
      },
    },
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