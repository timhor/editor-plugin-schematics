[![](https://circleci.com/gh/timhor/editor-plugin-schematics.svg?style=svg)](https://app.circleci.com/pipelines/github/timhor/editor-plugin-schematics)

# TWP Editor Plugin Schematics

CLI tool to automate scaffolding a new TWP editor plugin in the atlassian-frontend repo, as well as running codemods to update necessary files.

[Angular Schematics](https://angular.io/guide/schematics-authoring) is used to achieve this.

## License

Apache 2.0, see [LICENSE](https://github.com/timhor/editor-plugin-schematics/blob/master/LICENSE).

## Contributing

If you wish to contribute to this project, either create a GitHub issue or follow the usual fork/pull request workflow. Please see below for development instructions.

## Usage

Install globally:

```bash
yarn global add twp-editor-plugin-schematics
```

And then run in the root directory of the Atlassian Frontend repo:

```bash
~/atlassian-frontend$ editor-plugin
```

You will be prompted to answer a list of questions about your new plugin and then it will output a list of all the generated and updated files once completed 🚀

## Development

### Setup

Install schematics CLI tool globally:

```bash
yarn global add @angular-devkit/schematics-cli
```

And then set up the repo:

```bash
~$ git checkout git@github.com:timhor/editor-plugin-schematics.git
~/editor-plugin-schematics$ yarn
```

### Running locally

First you will need to set up a file system to mimic being in the root directory of atlassian-frontend:

```bash
~/editor-plugin-schematics$ yarn simulate:local
```

Then you can build the project and run the schematics:

```bash
~/editor-plugin-schematics$ yarn twp-editor-plugin
```

You can also pass through any general schematics options or options specific to our collection using flags:

```
~/editor-plugin-schematics$ yarn twp-editor-plugin --dry-run=false
~/editor-plugin-schematics$ yarn twp-editor-plugin --name="my awesome plugin"
```

### Running locally in Atlassian Frontend

You can run your local version against the atlassian-frontend repo, if you want to check that the integration works correctly.

First link via yarn to get the `editor-plugin` binary pointing to your local project:

```
~/editor-plugin-schematics$ yarn link
```

Then in the `atlassian-frontend` repo you can just run:

```
~/atlassian-frontend$ editor-plugin
```

And it will point to your local `editor-plugin-schematics` project.

### Working with TypeScript AST

- <https://ts-ast-viewer.com/#>
- <https://ts-morph.com/navigation/>
- <https://medium.com/humanitec-developers/update-and-insert-auto-generated-code-to-existing-typescript-html-and-json-files-with-angular-f0b00f22fb52>

### Testing

Tests are written using Jest, run them using:

```bash
yarn test
```
