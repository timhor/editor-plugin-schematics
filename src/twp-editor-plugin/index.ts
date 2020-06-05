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
  importStylesToContentStyles,
  importPluginToEditorLabs,
} from './codemods';

export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const {
      name: unformattedName,
      usePluginState,
      useStyles,
      useKeymap,
      useInputRules,
      addToLabs,
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

    if (useStyles) {
      const stylesTemplateSource = apply(url('./files/styles-templates'), [
        template({ ...options, ...strings }),
        move(pluginPath),
      ]);
      rules.push(mergeWith(stylesTemplateSource, MergeStrategy.Error));
      rules.push(importStylesToContentStyles(name));
    }

    if (useKeymap) {
      const keymapTemplateSource = apply(url('./files/keymap-templates'), [
        template({ ...options, ...strings }),
        move(pluginPath),
      ]);
      rules.push(mergeWith(keymapTemplateSource, MergeStrategy.Error));
    }

    if (useInputRules) {
      const inputRulesTemplateSource = apply(
        url('./files/input-rules-templates'),
        [template({ ...options, ...strings }), move(pluginPath)]
      );
      rules.push(mergeWith(inputRulesTemplateSource, MergeStrategy.Error));
    }

    rules.push(exportPluginFromIndex(name));
    rules.push(importPluginToCreatePluginsList(name));

    if (addToLabs) {
      rules.push(importPluginToEditorLabs(name));
    }

    return chain(rules)(tree, context);
  };
}
