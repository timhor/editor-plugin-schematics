import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const pluginBasePath = '/packages/editor/editor-core/src/plugins';

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

  it('generates index.tsx file', () => {
    expect(runSchematic('nice').files).toContain(
      `${pluginBasePath}/nice/index.tsx`
    );
  });

  describe('plugin-key.ts', () => {
    it('generates file', () => {
      expect(runSchematic('nice').files).toContain(
        `${pluginBasePath}/nice/plugin-key.ts`
      );
    });

    describe('exporting plugin key', () => {
      it('exports plugin key correctly', () => {
        const tree = runSchematic('nice');
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/plugin-key.ts`
        );
        expect(fileContent).toContain(
          `export const pluginKey = new PluginKey('nicePlugin')`
        );
      });

      it('exports plugin key correctly when plugin name has spaces', () => {
        const tree = runSchematic('something great');
        const fileContent = tree.readContent(
          `${pluginBasePath}/something-great/plugin-key.ts`
        );
        expect(fileContent).toContain(
          `export const pluginKey = new PluginKey('somethingGreatPlugin')`
        );
      });
    });
  });

  describe('styles.ts', () => {
    it('generates file', () => {
      expect(runSchematic('nice').files).toContain(
        `${pluginBasePath}/nice/styles.ts`
      );
    });

    it('generates file with no content', () => {
      const tree = runSchematic('nice');
      const fileContent = tree.readContent(`${pluginBasePath}/nice/styles.ts`);
      expect(fileContent).toEqual('');
    });
  });

  describe('formatting plugin directory name', () => {
    it('formats name with spaces', () => {
      expect(runSchematic('my awesome').files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });

    it('formats name with camel case', () => {
      expect(runSchematic('MyAwesome').files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });

    it('strips off final word "plugin" if passed in', () => {
      expect(runSchematic('my awesome plugin').files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });
  });
});
