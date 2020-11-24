import * as path from 'path';

export const editorCoreSrcPath = '/packages/editor/editor-core/src';

export const pluginBasePath = `${editorCoreSrcPath}/plugins`;
export const createEditorPath = `${editorCoreSrcPath}/create-editor`;
export const contentStylesPath = `${editorCoreSrcPath}/ui/ContentStyles`;

export const collectionPath = path.join(__dirname, '../collection.json');
export const testingDependenciesPath =
  'src/twp-editor-plugin/files/testing-dependencies';
