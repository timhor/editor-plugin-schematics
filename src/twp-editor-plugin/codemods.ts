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
} from './constants';
import {
  getTsNodes,
  getImportClosingBrace,
  getFinalImportStatementSemicolon,
  getVariableDeclarationStatement,
  getTemplateExpression,
  getPropertyAssignmentArrayClosingBracket,
} from './utils';

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
    const nodes = getTsNodes(tree, path);
    const recorder = tree.beginUpdate(path);

    const importClosingBrace = getImportClosingBrace(nodes, "'../plugins'");
    if (!importClosingBrace) {
      throw new SchematicsException(`Error locating plugin imports in ${path}`);
    }

    recorder.insertLeft(
      importClosingBrace.pos,
      `\n  ${strings.camelize(pluginName)}Plugin,`
    );

    const excludesDeclarationStatement = getVariableDeclarationStatement(
      nodes,
      'excludes'
    );
    if (!excludesDeclarationStatement) {
      throw new SchematicsException(
        `Error locating 'excludes' declaration statement in ${path}`
      );
    }

    recorder.insertLeft(
      excludesDeclarationStatement.pos,
      `\n\n  preset.add(${strings.camelize(pluginName)}Plugin);`
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}

export function importStylesToContentStyles(pluginName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = `${contentStylesPath}/index.tsx`;
    const nodes = getTsNodes(tree, path);
    const recorder = tree.beginUpdate(path);

    const finalImportStatementSemicolon = getFinalImportStatementSemicolon(
      nodes
    );
    if (!finalImportStatementSemicolon) {
      throw new SchematicsException(`Error locating imports in ${path}`);
    }

    recorder.insertRight(
      finalImportStatementSemicolon.pos + 1,
      `\nimport { ${strings.camelize(
        pluginName
      )}Styles } from '../../plugins/${strings.dasherize(pluginName)}/styles';`
    );

    const templateExpression = getTemplateExpression(nodes);
    if (!templateExpression) {
      throw new SchematicsException(
        `Error locating template expression in ${path}`
      );
    }

    recorder.insertRight(
      templateExpression.pos + templateExpression.getText().length - 1,
      '\n  ${' + strings.camelize(pluginName) + 'Styles}\n'
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}

export function addPluginToRank(pluginName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = `${pluginBasePath}/rank.ts`;
    const nodes = getTsNodes(tree, path);
    const recorder = tree.beginUpdate(path);

    const pluginRankClosingBracket = getPropertyAssignmentArrayClosingBracket(
      nodes,
      'plugins'
    );
    if (!pluginRankClosingBracket) {
      throw new SchematicsException(`Error locating plugins array in ${path}`);
    }

    recorder.insertLeft(
      pluginRankClosingBracket.pos,
      `\n    '${strings.camelize(pluginName)}',`
    );

    tree.commitUpdate(recorder);
    return tree;
  };
}
