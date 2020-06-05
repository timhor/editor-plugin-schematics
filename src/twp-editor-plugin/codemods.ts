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
import {
  getTsNodes,
  getImportClosingBrace,
  getFinalImportStatementSemicolon,
  getFunctionReturnStatement,
  getTemplateExpression,
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

    const pluginReturnStatement = getFunctionReturnStatement(
      nodes,
      'createPluginsList'
    );
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
      `\nimport ${strings.camelize(
        pluginName
      )}Plugin from '../../../plugins/${strings.dasherize(pluginName)}';`
    );

    const pluginReturnStatement = getFunctionReturnStatement(
      nodes,
      'useDefaultPreset'
    );
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
