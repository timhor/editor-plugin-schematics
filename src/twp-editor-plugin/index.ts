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
    const { name: unformattedName, usePluginState } = options;
    // strip final word "plugin" if provided
    const name = unformattedName.replace(/(\s)*plugin$/i, '');

    const pluginPath = normalize(
      `${pluginBasePath}/${strings.dasherize(name)}`
    );

    const rules: Rule[] = [];

    const templateSource = apply(url('./files/templates'), [
      template({ ...options, ...strings }),
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
