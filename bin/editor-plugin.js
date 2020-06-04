#!/usr/bin/env node
const spawn = require('spawndamnit');
const meow = require('meow');
const chalk = require('chalk');
const fs = require('fs');

const HELP_MSG = chalk.yellow(`
  Usage
    $ editor-plugin [options]

  Options
    --dryRun            Whether run should generate real files or just perform a dry run. Default: true
    --name              Plugin name. If not provided will be asked in a prompt.

  Examples
    $ editor-plugin --name="my awesome plugin"
    $ editor-plugin --dryRun

`);

const checkInAtlassianFrontendRepo = () => {
  const editorFolderExists = fs.existsSync('./packages/editor/editor-core');
  if (!editorFolderExists) {
    console.error(
      chalk.red(
        'You must be in the root directory of atlassian-frontend repo to run this tool'
      )
    );
    process.exit(1);
  }
};

const getSchematicsArgs = (flags) => {
  const { dryRun, name } = flags;

  const args = ['.:twp-editor-plugin', '--debug=true'];
  if (dryRun != undefined) {
    args.push(`--dryRun=${dryRun}`);
  }
  if (name) {
    args.push(`--name="${name}"`);
  }
  // Skipping the other options for now, as schematics is struggling with boolean flags
  // They become strings eg. 'false', and then this fails the schema check
  return args;
};

async function main() {
  const cli = meow(HELP_MSG);

  console.log(chalk.cyan('\nScaffolding new editor plugin...\n'));

  checkInAtlassianFrontendRepo();

  const child = spawn(
    // todo: point to schematics in a better way
    'schematics',
    getSchematicsArgs(cli.flags),
    { stdio: 'inherit' }
  );

  const { code } = await child;
  if (code !== 0) {
    process.exit(code);
  }

  console.log(chalk.green('\nPlugin scaffolded!'));
}

main().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
