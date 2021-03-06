#!/usr/bin/env node
const spawn = require('spawndamnit');
const meow = require('meow');
const chalk = require('chalk');
const fs = require('fs');
const ora = require('ora');

const HELP_MSG = chalk.yellow(`
  Usage
    $ editor-plugin [options]

  Options
    --dryRun            Whether run should generate real files or just perform a dry run. Default: false
    --name              Plugin name. If not provided will be asked via a prompt.

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

  const args = [
    `${__dirname}/..:twp-editor-plugin`,
    '--debug=true',
    `--dryRun=${dryRun == undefined ? false : dryRun}`,
  ];
  if (name) {
    args.push(`--name="${name}"`);
  }
  // Skipping the other options for now, as schematics is struggling with boolean flags
  // They become strings eg. 'false', and then this fails the schema check
  return args;
};

async function main() {
  const cli = meow(HELP_MSG);

  console.log('');
  const spinner = ora(chalk.cyan('Scaffolding new editor plugin...')).start();
  // Spinner overrides stdout so it needs to be disabled before first prompt appears
  // Unfortunately there was no easy way to wait until prompted, so waiting for
  // this magic 2s which seems to be okay
  setTimeout(() => {
    spinner.stopAndPersist();
    console.log('');
  }, 2000);

  checkInAtlassianFrontendRepo();

  // We use npx as it will install the package if it can't find it
  // This means users don't need to already have installed schematics-cli globally
  const child = spawn(
    'npx',
    [
      '--quiet',
      '@angular-devkit/schematics-cli',
      ...getSchematicsArgs(cli.flags),
    ],
    {
      stdio: 'inherit',
    }
  );

  const { code } = await child;
  if (code !== 0) {
    process.exit(code);
  }

  console.log(chalk.green('\nPlugin successfully scaffolded!'));
}

main().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
