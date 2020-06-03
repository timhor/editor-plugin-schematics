import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  MergeStrategy,
  mergeWith,
  chain,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { TwpEditorPluginOptions } from './types';
import { normalize } from 'path';

const kebabCasePluginName = (name: string): string =>
  name
    .replace(/(\s)*plugin$/i, '')
    .replace(/\s/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const camelCasePluginName = (name: string): string =>
  name
    .replace(/(\s)*plugin$/i, '')
    .replace(/\s(\w)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '');

const createTestFolders = (tree: Tree, pluginPath: string) => {
  tree.create(`${pluginPath}/__tests__/unit/.gitkeep`, '');
  tree.create(`${pluginPath}/__tests__/integration/.gitkeep`, '');
  tree.create(`${pluginPath}/__tests__/visual-regression/.gitkeep`, '');
};

export const pluginBasePath = '/packages/editor/editor-core/src/plugins';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const { name, usePluginState } = options;
    const formattedName = {
      kebab: kebabCasePluginName(name),
      camel: camelCasePluginName(name),
    };

    const pluginPath = normalize(`${pluginBasePath}/${formattedName.kebab}`);

    const rules: Rule[] = [];

    const templateSource = apply(url('./files/templates'), [
      template({ ...options, ...strings, formattedName }),
      move(pluginPath),
    ]);
    const merge = mergeWith(templateSource, MergeStrategy.Error);
    rules.push(merge);

    createTestFolders(tree, pluginPath);

    if (usePluginState) {
      const pluginStateTemplateSource = apply(
        url('./files/plugin-state-templates'),
        [template({ ...options, ...strings }), move(pluginPath)]
      );
      rules.push(mergeWith(pluginStateTemplateSource, MergeStrategy.Error));
    }

    return chain(rules)(tree, context);
  };
}
