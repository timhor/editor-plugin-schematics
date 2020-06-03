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
    const sourceTree = Tree.empty();
    sourceTree.create(`${pluginBasePath}/index.ts`, '');
    const tree = runner.runSchematic(
      'twp-editor-plugin',
      { name, usePluginState },
      sourceTree
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
          `export const nicePluginKey = new PluginKey('nicePlugin')`
        );
      });

      it('exports plugin key correctly when plugin name has spaces', () => {
        const tree = runSchematic('something great');
        const fileContent = tree.readContent(
          `${pluginBasePath}/something-great/plugin-key.ts`
        );
        expect(fileContent).toContain(
          `export const somethingGreatPluginKey = new PluginKey('somethingGreatPlugin')`
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

    describe('when not using plugin state', () => {
      it('generates file with no content', () => {
        const tree = runSchematic('nice');
        const fileContent = tree.readContent(`${pluginBasePath}/nice/types.ts`);
        expect(fileContent).toEqual('');
      });
    });

    describe('when using plugin state', () => {
      describe('generating content', () => {
        it('adds plugin state type', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/types.ts`
          );
          expect(fileContent).toContain(
            'export interface NicePluginState {\n\n}'
          );
        });

        describe('when plugin name is multi-word', () => {
          it('adds plugin state type', () => {
            const tree = runSchematic('some awesome', true);
            const fileContent = tree.readContent(
              `${pluginBasePath}/some-awesome/types.ts`
            );
            expect(fileContent).toContain(
              'export interface SomeAwesomePluginState {\n\n}'
            );
          });
        });
      });
    });
  });

  describe('commands.ts', () => {
    it('generates file', () => {
      expect(runSchematic('nice').files).toContain(
        `${pluginBasePath}/nice/commands.ts`
      );
    });

    describe('when not using plugin state', () => {
      it('generates file with no content', () => {
        const tree = runSchematic('nice');
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/commands.ts`
        );
        expect(fileContent).toEqual('');
      });
    });

    describe('when using plugin state', () => {
      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/commands.ts`
          );

          expect(fileContent).toContain(
            "import { createCommand } from './pm-plugins/plugin-factory';"
          );
          expect(fileContent).toContain(
            "import { NiceActionTypes } from './actions';"
          );
        });

        it('generates placeholder command', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/commands.ts`
          );

          expect(fileContent).toContain(
            'export const someCommand = () =>' +
              '\n  createCommand({' +
              '\n    type: NiceActionTypes.SOME_ACTION,' +
              '\n  });'
          );
        });

        describe('when plugin name is multi-word', () => {
          it('imports types', () => {
            const tree = runSchematic('some awesome', true);
            const fileContent = tree.readContent(
              `${pluginBasePath}/some-awesome/commands.ts`
            );

            expect(fileContent).toContain(
              "import { SomeAwesomeActionTypes } from './actions';"
            );
          });
        });
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
            'pluginFactory(nicePluginKey, reducer, /** { mapping, onDocChanged, onSelectionChanged } **/)'
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
              '\n    case NiceActionTypes.SOME_ACTION:' +
              '\n      return { ...state, /** new plugin state values go here **/ };' +
              '\n' +
              '\n    default: return state;' +
              '\n  }' +
              '\n}'
          );
        });
      });
    });
  });

  describe('pm-plugins/main.ts', () => {
    describe('when using plugin state', () => {
      it('generates file', () => {
        const tree = runSchematic('nice', true);
        expect(tree.files).toContain(
          `${pluginBasePath}/nice/pm-plugins/main.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            "import { Plugin } from 'prosemirror-state';"
          );
          expect(fileContent).toContain(
            "import { nicePluginKey } from '../plugin-key';"
          );
          expect(fileContent).toContain(
            "import { PMPluginFactoryParams } from '../../../types';"
          );
          expect(fileContent).toContain(
            "import { createPluginState } from './plugin-factory';"
          );
          expect(fileContent).toContain(
            "import { NicePluginState } from '../types';"
          );
        });

        it('creates initial plugin state', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            'const initialState: NicePluginState = {\n\n};'
          );
        });

        it('creates plugin using plugin state', () => {
          const tree = runSchematic('nice', true);
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            'export const createPlugin = ({' +
              '\n  dispatch: Dispatch,' +
              '\n}: PMPluginFactoryParams) =>' +
              '\n  new Plugin({' +
              '\n    key: nicePluginKey,' +
              '\n    state: createPluginState(dispatch, initialState),' +
              '\n    props: { /* props like nodeViews or decorations */ },' +
              '\n  });'
          );
        });
      });
    });

    describe('when not using plugin state', () => {
      it('generates file', () => {
        const tree = runSchematic('nice', true);
        expect(tree.files).toContain(
          `${pluginBasePath}/nice/pm-plugins/main.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic('nice');
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            "import { Plugin } from 'prosemirror-state';"
          );
          expect(fileContent).toContain(
            "import { nicePluginKey } from '../plugin-key';"
          );
          expect(fileContent).toContain(
            "import { PMPluginFactoryParams } from '../../../types';"
          );
          expect(fileContent).not.toContain(
            "import { createPluginState } from './plugin-factory';"
          );
          expect(fileContent).not.toContain(
            "import { NicePluginState } from '../types';"
          );
        });

        it("doesn't create initial plugin state", () => {
          const tree = runSchematic('nice');
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).not.toContain(
            'const initialState: NicePluginState = {\n\n};'
          );
        });

        it('creates plugin without plugin state', () => {
          const tree = runSchematic('nice');
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            'export const createPlugin = ({' +
              '\n  dispatch: Dispatch,' +
              '\n}: PMPluginFactoryParams) =>' +
              '\n  new Plugin({' +
              '\n    key: nicePluginKey,' +
              '\n    props: { /* props like nodeViews or decorations */ },' +
              '\n  });'
          );
        });
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

  describe('codemods for existing architecture', () => {
    it('adds export from index.ts', () => {
      const tree = runSchematic('nice');
      const fileContent = tree.readContent(`${pluginBasePath}/index.ts`);
      expect(fileContent).toContain(
        "export { default as nicePlugin } from './nice';"
      );
    });
  });
});
