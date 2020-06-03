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
import { pluginBasePath } from './constants';
import { createTestFolders } from './utils';
import {
  exportPluginFromIndex,
  importPluginToCreatePluginsList,
} from './codemods';

export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const {
      name: unformattedName,
      usePluginState,
      useKeymap,
      useInputRules,
    } = options;

    // strip final word "plugin" if provided, and any quotes
    const name = unformattedName
      .replace(/(\s)*plugin$/i, '')
      .replace(/['"]/g, '');
    const pluginPath = normalize(
      `${pluginBasePath}/${strings.dasherize(name)}`
    );

    const rules: Rule[] = [];

    const templateSource = apply(url('./files/templates'), [
      template({ ...options, ...strings }),
      move(pluginPath),
    ]);
    rules.push(mergeWith(templateSource, MergeStrategy.Error));

    createTestFolders(tree, pluginPath);

    if (usePluginState) {
      const pluginStateTemplateSource = apply(
        url('./files/plugin-state-templates'),
        [template({ ...options, ...strings }), move(pluginPath)]
      );
      rules.push(mergeWith(pluginStateTemplateSource, MergeStrategy.Error));
    }

    if (useKeymap) {
      const pluginStateTemplateSource = apply(url('./files/keymap-templates'), [
        template({ ...options, ...strings }),
        move(pluginPath),
      ]);
      rules.push(mergeWith(pluginStateTemplateSource, MergeStrategy.Error));
    }

    if (useInputRules) {
      const pluginStateTemplateSource = apply(
        url('./files/input-rules-templates'),
        [template({ ...options, ...strings }), move(pluginPath)]
      );
      rules.push(mergeWith(pluginStateTemplateSource, MergeStrategy.Error));
    }

    rules.push(exportPluginFromIndex(name));
    rules.push(importPluginToCreatePluginsList(name));

    return chain(rules)(tree, context);
  };
}
