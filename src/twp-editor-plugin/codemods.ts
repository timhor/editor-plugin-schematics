import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { pluginBasePath, createEditorPath } from './constants';
import { getSourceNodes } from './utils';
import * as ts from 'typescript';

export function exportPluginFromIndex(pluginName: string): Rule {
  return (tree: Tree) => {
    const path = `${pluginBasePath}/index.ts`;
    const buffer = tree.read(path);
    if (!buffer) {
      throw new SchematicsException(`File ${path} not found`);
    }
    const recorder = tree.beginUpdate(path);
    recorder.insertRight(
      buffer.length,
      `export { default as ${strings.camelize(
        pluginName
      )}Plugin } from './${strings.dasherize(pluginName)}';\n`
    );
    tree.commitUpdate(recorder);
    return tree;
  };
}

export function importPluginToCreatePluginsList(pluginName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = `${createEditorPath}/create-plugins-list.ts`;
    const buffer = tree.read(path);
    if (!buffer) {
      throw new SchematicsException(`File ${path} not found`);
    }

    const recorder = tree.beginUpdate(path);
    const source = ts.createSourceFile(
      path,
      buffer.toString(),
      ts.ScriptTarget.Latest,
      true
    );
    const nodes = getSourceNodes(source);

    const importClosingBrace = nodes
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportDeclaration)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportClause)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.NamedImports)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.CloseBraceToken);
    if (!importClosingBrace) {
      throw new SchematicsException(`Error locating imports in ${path}`);
    }

    recorder.insertLeft(
      importClosingBrace.pos,
      `\n  ${strings.camelize(pluginName)}Plugin,`
    );

    const pluginReturnStatement = nodes
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.FunctionDeclaration)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.Block)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.SyntaxList)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ReturnStatement);
    if (!pluginReturnStatement) {
      throw new SchematicsException(
        `Error locating plugin return statement in ${path}`
      );
    }

    recorder.insertLeft(
      pluginReturnStatement.pos,
      `\n\n  plugins.push(${strings.camelize(pluginName)}Plugin());`
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}

// useful functions for developing codemods - to run: yarn build && node src/twp-editor-plugin/codemods.js
// from https://medium.com/humanitec-developers/update-and-insert-auto-generated-code-to-existing-typescript-html-and-json-files-with-angular-f0b00f22fb52

// import { manualTestingPath } from './constants';
// import * as fs from 'fs';

// function showTree(node: ts.Node, indent: string = '    '): void {
//   // output the syntax kind of the node
//   console.log(indent + ts.SyntaxKind[node.kind]);
//   // output the text of node
//   if (node.getChildCount() === 0) {
//     console.log(indent + '    Text: ' + node.getText());
//   }
//   // output the children nodes
//   for (let child of node.getChildren()) {
//     showTree(child, indent + '    ');
//   }
// }

// let buffer = fs.readFileSync(
//   `${manualTestingPath}/create-plugins-list.ts`

// );
// let content = buffer.toString('utf-8');
// let node = ts.createSourceFile(
//   'create-plugins-list.ts',
//   content,
//   ts.ScriptTarget.Latest,
//   true
// );
// showTree(node);
