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
  SchematicsException,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { TwpEditorPluginOptions } from './types';
import { normalize } from 'path';
import * as ts from 'typescript';
import { createTestFolders, getSourceNodes } from './utils';

export const pluginBasePath = '/packages/editor/editor-core/src/plugins';
export const createEditorPath =
  '/packages/editor/editor-core/src/create-editor';

export function twpEditorPlugin(options: TwpEditorPluginOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const {
      name: unformattedName,
      usePluginState,
      useKeymap,
      useInputRules,
    } = options;

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
    rules.push(mergeWith(templateSource, MergeStrategy.Error));

    createTestFolders(tree, pluginPath);

    if (usePluginState) {
      const pluginStateTemplateSource = apply(
        url('./files/plugin-state-templates'),
        [template({ ...options, ...strings }), move(pluginPath)]
      );
      rules.push(mergeWith(pluginStateTemplateSource, MergeStrategy.Error));
    }

    rules.push(exportPluginFromIndex(name));
    rules.push(importPluginToCreatePluginsList(name));

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

    return chain(rules)(tree, context);
  };
}

function exportPluginFromIndex(pluginName: string): Rule {
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

function importPluginToCreatePluginsList(pluginName: string): Rule {
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
