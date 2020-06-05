import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export const createTestFolders = (tree: Tree, pluginPath: string) => {
  tree.create(`${pluginPath}/__tests__/unit/.gitkeep`, '');
  tree.create(`${pluginPath}/__tests__/integration/.gitkeep`, '');
  tree.create(`${pluginPath}/__tests__/visual-regression/.gitkeep`, '');
};

// from https://dev.to/thisdotmedia/schematics-building-blocks-2mg3
export const getSourceNodes = (sourceFile: ts.SourceFile) => {
  const nodes: ts.Node[] = [sourceFile];
  const result: ts.Node[] = [];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node) {
      result.push(node);
      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren());
      }
    }
  }

  return result;
};

export const getTsNodes = (tree: Tree, path: string) => {
  const buffer = tree.read(path);
  if (!buffer) {
    throw new SchematicsException(`File ${path} not found`);
  }

  const source = ts.createSourceFile(
    path,
    buffer.toString(),
    ts.ScriptTarget.Latest,
    true
  );

  return getSourceNodes(source);
};

export const getImportClosingBrace = (nodes: ts.Node[], importSource: string) =>
  nodes
    .find(
      (node: ts.Node) =>
        node.kind === ts.SyntaxKind.ImportDeclaration &&
        node.getText().includes(importSource)
    )
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportClause)
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.NamedImports)
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.CloseBraceToken);

export const getFinalImportStatementSemicolon = (nodes: ts.Node[]) =>
  nodes
    .slice()
    .reverse()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.ImportDeclaration)
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.SemicolonToken);

export const getFunctionReturnStatement = (
  nodes: ts.Node[],
  functionName: string
) =>
  nodes
    .find(
      (node: ts.Node) =>
        node.kind === ts.SyntaxKind.FunctionDeclaration &&
        node.getText().includes(functionName)
    )
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.Block)
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.SyntaxList)
    ?.getChildren()
    .find((node: ts.Node) => node.kind === ts.SyntaxKind.ReturnStatement);

export const getTemplateExpression = (nodes: ts.Node[]) =>
  nodes.find((node: ts.Node) => node.kind === ts.SyntaxKind.TemplateExpression);
