import { Tree } from '@angular-devkit/schematics';
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
