import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import {
  pluginBasePath,
  createEditorPath,
  contentStylesPath,
  editorLabsPath,
} from './constants';
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
      .find(
        (node: ts.Node) =>
          node.kind === ts.SyntaxKind.ImportDeclaration &&
          node.getText().includes("'../plugins'")
      )
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportClause)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.NamedImports)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.CloseBraceToken);
    if (!importClosingBrace) {
      throw new SchematicsException(`Error locating plugin imports in ${path}`);
    }

    recorder.insertLeft(
      importClosingBrace.pos,
      `\n  ${strings.camelize(pluginName)}Plugin,`
    );

    const pluginReturnStatement = nodes
      .find(
        (node: ts.Node) =>
          node.kind === ts.SyntaxKind.FunctionDeclaration &&
          node.getText().includes('createPluginsList')
      )
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

export function importPluginToEditorLabs(pluginName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = `${editorLabsPath}/default.tsx`;
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

    const finalImportStatement = nodes
      .slice()
      .reverse()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportDeclaration)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.SemicolonToken);
    if (!finalImportStatement) {
      throw new SchematicsException(`Error locating imports in ${path}`);
    }

    recorder.insertRight(
      finalImportStatement.pos + 1,
      `\nimport ${strings.camelize(
        pluginName
      )}Plugin from '../../../plugins/${strings.dasherize(pluginName)}';`
    );

    const pluginReturnStatement = nodes
      .find(
        (node: ts.Node) =>
          node.kind === ts.SyntaxKind.FunctionDeclaration &&
          node.getText().includes('useDefaultPreset')
      )
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
      `\n  preset.add(${strings.camelize(pluginName)}Plugin);`
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}

export function importStylesToContentStyles(pluginName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = `${contentStylesPath}/index.ts`;
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

    const finalImportStatement = nodes
      .slice()
      .reverse()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportDeclaration)
      ?.getChildren()
      .find((node: ts.Node) => node.kind === ts.SyntaxKind.SemicolonToken);
    if (!finalImportStatement) {
      throw new SchematicsException(`Error locating imports in ${path}`);
    }

    recorder.insertRight(
      finalImportStatement.pos + 1,
      `\nimport { ${strings.camelize(
        pluginName
      )}Styles } from '../../plugins/${strings.dasherize(pluginName)}/styles';`
    );

    const pluginReturnStatement = nodes.find(
      (node: ts.Node) => node.kind === ts.SyntaxKind.TemplateExpression
    );
    if (!pluginReturnStatement) {
      throw new SchematicsException(
        `Error locating plugin return statement in ${path}`
      );
    }

    recorder.insertRight(
      pluginReturnStatement.pos + pluginReturnStatement.getText().length - 1,
      '\n  ${' + strings.camelize(pluginName) + 'Styles}\n'
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}
