import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { TwpEditorPluginOptions } from "./types";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log({ options });
    return tree;
  };
}
