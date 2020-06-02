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
} from '@angular-devkit/schematics';
import { TwpEditorPluginOptions } from './types';
import { normalize } from 'path';

const formatPluginName = (name: string): string =>
  name
    .replace(/\s/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const { name } = options;
    const formattedName = formatPluginName(name);
    const pluginPath = normalize(
      `packages/editor/editor-core/src/plugins/${formattedName}`
    );

    const templateSource = apply(url('./templates'), [
      template({ ...options }),
      move(pluginPath),
    ]);
    const merge = mergeWith(templateSource, MergeStrategy.Error);
    return merge(tree, context);
  };
}
