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

  describe('pm-plugins/plugin-factory.ts', () => {
    describe('when not using plugin state', () => {
      it("doesn't generate file", () => {
        expect(runSchematic('nice').files).not.toContain(
          `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
        );
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(runSchematic('nice', true).files).toContain(
          `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
          );

          expect(fileContent).toContain(
            "import { pluginFactory } from '../../utils/plugin-state-factory';"
          );
          expect(fileContent).toContain(
            "import { nicePluginKey } from '../plugin-key';"
          );
          expect(fileContent).toContain(
            "import { NicePluginState } from '../types';"
          );
          expect(fileContent).toContain(
            "import { reducer } from '../reducer';"
          );
        });

        it('creates plugin factory', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
          );
          expect(fileContent).toContain(
            'pluginFactory(nicePluginKey, reducer)'
          );
        });

        it('exports plugin factory helpers', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
          );
          expect(fileContent).toContain(
            'export const {' +
              '\n  createCommand,' +
              '\n  getPluginState,' +
              '\n  createPluginState,' +
              '\n}'
          );
        });

        describe('when plugin name is multi-word', () => {
          it('imports types', () => {
            const tree = runSchematic('some awesome', true);
            const fileContent = tree.readContent(
              `${pluginBasePath}/some-awesome/pm-plugins/plugin-factory.ts`
            );

            expect(fileContent).toContain(
              "import { pluginFactory } from '../../utils/plugin-state-factory';"
            );
            expect(fileContent).toContain(
              "import { someAwesomePluginKey } from '../plugin-key';"
            );
            expect(fileContent).toContain(
              "import { SomeAwesomePluginState } from '../types';"
            );
            expect(fileContent).toContain(
              "import { reducer } from '../reducer';"
            );
          });
        });
      });
    });
  });

  describe('actions.ts', () => {
    describe('when not using plugin state', () => {
      it("doesn't generate file", () => {
        expect(runSchematic('nice').files).not.toContain(
          `${pluginBasePath}/nice/actions.ts`
        );
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(runSchematic('nice', true).files).toContain(
          `${pluginBasePath}/nice/actions.ts`
        );
      });

      describe('generating content', () => {
        it('adds actions enum', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/actions.ts`
          );
          expect(fileContent).toContain(
            'export enum NiceActionTypes {' +
              "\n  SOME_ACTION = 'SOME_ACTION'" +
              '\n}'
          );
        });

        it('adds placeholder action', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/actions.ts`
          );
          expect(fileContent).toContain(
            'export interface SomeNiceAction {' +
              '\n  type: NiceActionTypes.SOME_ACTION' +
              '\n}'
          );
        });

        it('exports action type', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/actions.ts`
          );
          expect(fileContent).toContain(
            'export type NiceAction = SomeNiceAction'
          );
        });
      });
    });
  });

  describe('reducer.ts', () => {
    describe('when not using plugin state', () => {
      it("doesn't generate file", () => {
        expect(runSchematic('nice').files).not.toContain(
          `${pluginBasePath}/nice/reducer.ts`
        );
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(runSchematic('nice', true).files).toContain(
          `${pluginBasePath}/nice/reducer.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/reducer.ts`
          );
          expect(fileContent).toContain(
            "import { NicePluginState } from './types'"
          );
          expect(fileContent).toContain(
            "import { NiceActionTypes, NiceAction } from './actions'"
          );
        });

        it('exports reducer function', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/reducer.ts`
          );
          expect(fileContent).toContain(
            'export function reducer(state: NicePluginState, action: NiceAction): NicePluginState {' +
              '\n  switch(action.type) {' +
              '\n    default: return state;' +
              '\n  }' +
              '\n}'
          );
        });
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

  it('generates __tests__ folders', () => {
    expect(runSchematic('nice').files).toContain(
      `${pluginBasePath}/nice/__tests__/unit/.gitkeep`
    );
    expect(runSchematic('nice').files).toContain(
      `${pluginBasePath}/nice/__tests__/integration/.gitkeep`
    );
    expect(runSchematic('nice').files).toContain(
      `${pluginBasePath}/nice/__tests__/visual-regression/.gitkeep`
    );
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
