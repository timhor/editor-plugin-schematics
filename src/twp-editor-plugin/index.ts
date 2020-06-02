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

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log({ options });
    const pluginPath = normalize(
      `packages/editor/editor-core/src/plugins/${options.name}`
    );
    const templateSource = apply(url('./templates'), [
      template({ ...options }),
      move(pluginPath),
    ]);
    const merge = mergeWith(templateSource, MergeStrategy.Error);
    return merge(tree, context);
  };
}
