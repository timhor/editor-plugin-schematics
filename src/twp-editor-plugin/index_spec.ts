import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('twp-editor-plugin', () => {
  const runSchematic = (name: string, usePluginState = false): UnitTestTree => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic(
      'twp-editor-plugin',
      { name, usePluginState },
      Tree.empty()
    );
    return tree;
  };

  it('generates index file', () => {
    expect(runSchematic('plugin').files).toContain(
      '/packages/editor/editor-core/src/plugins/plugin/index.tsx'
    );
  });

  describe('formatting plugin name', () => {
    it('formats name with spaces', () => {
      expect(runSchematic('my awesome plugin').files).toContain(
        '/packages/editor/editor-core/src/plugins/my-awesome-plugin/index.tsx'
      );
    });

    it('formats name with camel case', () => {
      expect(runSchematic('MyAwesomePlugin').files).toContain(
        '/packages/editor/editor-core/src/plugins/my-awesome-plugin/index.tsx'
      );
    });
  });
});
