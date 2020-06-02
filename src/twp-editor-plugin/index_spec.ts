import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { pluginBasePath } from './index';

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

  describe('types.ts', () => {
    it('generates file', () => {
      expect(runSchematic('nice').files).toContain(
        `${pluginBasePath}/nice/types.ts`
      );
    });

    it('generates file with no content', () => {
      const tree = runSchematic('nice');
      const fileContent = tree.readContent(`${pluginBasePath}/nice/types.ts`);
      expect(fileContent).toEqual('');
    });
  });

  describe('commands.ts', () => {
    it('generates file', () => {
      expect(runSchematic('nice').files).toContain(
        `${pluginBasePath}/nice/commands.ts`
      );
    });

    describe('when no plugin state', () => {
      it('generates file with no content', () => {
        const tree = runSchematic('nice');
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/commands.ts`
        );
        expect(fileContent).toEqual('');
      });
    });
  });

  describe('pm-plugins/main.ts', () => {
    it('generates file', () => {
      const tree = runSchematic('nice', true);
      expect(tree.files).toContain(`${pluginBasePath}/nice/pm-plugins/main.ts`);
      const fileContent = tree.readContent(
        `${pluginBasePath}/nice/pm-plugins/main.ts`
      );
      expect(fileContent.includes('createPluginState')).toBeTruthy();
    });

    describe('when no plugin state', () => {
      it('generates file without createPluginState', () => {
        const tree = runSchematic('nice');
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/pm-plugins/main.ts`
        );
        expect(fileContent.includes('createPluginState')).toBeFalsy();
      });
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
