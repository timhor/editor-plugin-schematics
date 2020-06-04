import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as fs from 'fs';
import {
  pluginBasePath,
  createEditorPath,
  collectionPath,
  manualTestingPath,
} from './constants';
import { TwpEditorPluginOptions } from './types';

describe('twp-editor-plugin', () => {
  const runSchematic = (options: TwpEditorPluginOptions): UnitTestTree => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const sourceTree = Tree.empty();

    // populate source tree with sample index.ts contents
    const indexContent = fs
      .readFileSync(`${manualTestingPath}/index.ts`)
      .toString('utf-8');
    sourceTree.create(`${pluginBasePath}/index.ts`, indexContent);

    // populate source tree with sample create-plugins-list.ts contents
    const createPluginsListContent = fs
      .readFileSync(`${manualTestingPath}/create-plugins-list.ts`)
      .toString('utf-8');
    sourceTree.create(
      `${createEditorPath}/create-plugins-list.ts`,
      createPluginsListContent
    );

    const tree = runner.runSchematic('twp-editor-plugin', options, sourceTree);
    return tree;
  };

  describe('index.tsx', () => {
    it('generates file', () => {
      expect(runSchematic({ name: 'nice' }).files).toContain(
        `${pluginBasePath}/nice/index.tsx`
      );
    });

    describe('when using styles', () => {
      it('generates file', () => {
        expect(runSchematic({ name: 'nice' }).files).toContain(
          `${pluginBasePath}/nice/styles.ts`
        );
      });
    });

    describe('when not using styles', () => {
      it("doesn't generate file", () => {
        expect(
          runSchematic({ name: 'nice', useStyles: false }).files
        ).not.toContain(`${pluginBasePath}/nice/styles.ts`);
      });
    });

    describe('when using keymaps', () => {
      it('imports keymap plugin', () => {
        const tree = runSchematic({ name: 'nice', useKeymap: true });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).toContain(
          "import keymapPlugin from './pm-plugins/keymap';"
        );
      });

      it('adds keymap plugin into pmPlugins array', () => {
        const tree = runSchematic({ name: 'nice', useKeymap: true });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).toContain(
          '      {' +
            "\n        name: 'niceKeymap'," +
            '\n        plugin: () => keymapPlugin(),' +
            '\n      },'
        );
      });
    });

    describe('when not using keymaps', () => {
      it("doesn't import keymap plugin", () => {
        const tree = runSchematic({ name: 'nice', useKeymap: false });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).not.toContain(
          "import keymapPlugin from './pm-plugins/keymap';"
        );
      });

      it("doesn't add keymap plugin into pmPlugins array", () => {
        const tree = runSchematic({ name: 'nice', useKeymap: false });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).not.toContain(
          '      {' +
            "\n        name: 'niceKeymap'," +
            '\n        plugin: () => keymapPlugin(),' +
            '\n      },'
        );
      });
    });

    describe('when using input rules', () => {
      it('imports input rules plugin', () => {
        const tree = runSchematic({ name: 'nice', useInputRules: true });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).toContain(
          "import inputRulesPlugin from './pm-plugins/input-rules';"
        );
      });

      it('adds input rules plugin into pmPlugins array', () => {
        const tree = runSchematic({ name: 'nice', useInputRules: true });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).toContain(
          '      {' +
            "\n        name: 'niceInputRules'," +
            '\n        plugin: ({ schema }) => inputRulesPlugin(schema),' +
            '\n      },'
        );
      });
    });

    describe('when not using input rules', () => {
      it("doesn't import input rules plugin", () => {
        const tree = runSchematic({ name: 'nice', useInputRules: false });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).not.toContain(
          "import inputRulesPlugin from './pm-plugins/input-rules';"
        );
      });

      it("doesn't add input rules plugin into pmPlugins array", () => {
        const tree = runSchematic({ name: 'nice', useInputRules: false });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/index.tsx`
        );
        expect(fileContent).not.toContain(
          '      {' +
            "\n        name: 'niceInputRules'," +
            '\n        plugin: ({ schema }) => inputRulesPlugin(schema),' +
            '\n      },'
        );
      });
    });
  });

  describe('plugin-key.ts', () => {
    it('generates file', () => {
      expect(runSchematic({ name: 'nice' }).files).toContain(
        `${pluginBasePath}/nice/plugin-key.ts`
      );
    });

    describe('exporting plugin key', () => {
      it('exports plugin key correctly', () => {
        const tree = runSchematic({ name: 'nice' });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/plugin-key.ts`
        );
        expect(fileContent).toContain(
          `export const nicePluginKey = new PluginKey('nicePlugin')`
        );
      });

      it('exports plugin key correctly when plugin name has spaces', () => {
        const tree = runSchematic({ name: 'something great' });
        const fileContent = tree.readContent(
          `${pluginBasePath}/something-great/plugin-key.ts`
        );
        expect(fileContent).toContain(
          `export const somethingGreatPluginKey = new PluginKey('somethingGreatPlugin')`
        );
      });
    });
  });

  describe('types.ts', () => {
    it('generates file', () => {
      expect(runSchematic({ name: 'nice' }).files).toContain(
        `${pluginBasePath}/nice/types.ts`
      );
    });

    describe('when not using plugin state', () => {
      it('generates file with no content', () => {
        const tree = runSchematic({ name: 'nice', usePluginState: false });
        const fileContent = tree.readContent(`${pluginBasePath}/nice/types.ts`);
        expect(fileContent).toEqual('');
      });
    });

    describe('when using plugin state', () => {
      describe('generating content', () => {
        it('adds plugin state type', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/types.ts`
          );
          expect(fileContent).toContain(
            'export interface NicePluginState {\n\n}'
          );
        });

        describe('when plugin name is multi-word', () => {
          it('adds plugin state type', () => {
            const tree = runSchematic({
              name: 'some awesome',
              usePluginState: true,
            });
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
      expect(runSchematic({ name: 'nice' }).files).toContain(
        `${pluginBasePath}/nice/commands.ts`
      );
    });

    describe('when not using plugin state', () => {
      it('generates file with no content', () => {
        const tree = runSchematic({ name: 'nice', usePluginState: false });
        const fileContent = tree.readContent(
          `${pluginBasePath}/nice/commands.ts`
        );
        expect(fileContent).toEqual('');
      });
    });

    describe('when using plugin state', () => {
      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
            const tree = runSchematic({
              name: 'some awesome',
              usePluginState: true,
            });
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
        expect(
          runSchematic({ name: 'nice', usePluginState: false }).files
        ).not.toContain(`${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`);
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(
          runSchematic({ name: 'nice', usePluginState: true }).files
        ).toContain(`${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`);
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/plugin-factory.ts`
          );
          expect(fileContent).toContain(
            'pluginFactory(nicePluginKey, reducer, /** { mapping, onDocChanged, onSelectionChanged } **/)'
          );
        });

        it('exports plugin factory helpers', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
            const tree = runSchematic({
              name: 'some awesome',
              usePluginState: true,
            });
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
        expect(
          runSchematic({ name: 'nice', usePluginState: false }).files
        ).not.toContain(`${pluginBasePath}/nice/actions.ts`);
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(
          runSchematic({ name: 'nice', usePluginState: true }).files
        ).toContain(`${pluginBasePath}/nice/actions.ts`);
      });

      describe('generating content', () => {
        it('adds actions enum', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
        expect(
          runSchematic({ name: 'nice', usePluginState: false }).files
        ).not.toContain(`${pluginBasePath}/nice/reducer.ts`);
      });
    });

    describe('when using plugin state', () => {
      it('generates file', () => {
        expect(
          runSchematic({ name: 'nice', usePluginState: true }).files
        ).toContain(`${pluginBasePath}/nice/reducer.ts`);
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
        const tree = runSchematic({ name: 'nice', usePluginState: true });
        expect(tree.files).toContain(
          `${pluginBasePath}/nice/pm-plugins/main.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
          const tree = runSchematic({ name: 'nice', usePluginState: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).toContain(
            'const initialState: NicePluginState = {\n\n};'
          );
        });

        it('creates plugin using plugin state', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: true });
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
        const tree = runSchematic({ name: 'nice', usePluginState: false });
        expect(tree.files).toContain(
          `${pluginBasePath}/nice/pm-plugins/main.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: false });
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
          const tree = runSchematic({ name: 'nice', usePluginState: false });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/main.ts`
          );
          expect(fileContent).not.toContain(
            'const initialState: NicePluginState = {\n\n};'
          );
        });

        it('creates plugin without plugin state', () => {
          const tree = runSchematic({ name: 'nice', usePluginState: false });
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
    expect(runSchematic({ name: 'nice' }).files).toContain(
      `${pluginBasePath}/nice/__tests__/unit/.gitkeep`
    );
    expect(runSchematic({ name: 'nice' }).files).toContain(
      `${pluginBasePath}/nice/__tests__/integration/.gitkeep`
    );
    expect(runSchematic({ name: 'nice' }).files).toContain(
      `${pluginBasePath}/nice/__tests__/visual-regression/.gitkeep`
    );
  });

  describe('README.md', () => {
    it('generates readme file', () => {
      expect(runSchematic({ name: 'nice' }).files).toContain(
        `${pluginBasePath}/nice/README.md`
      );
    });

    it('prefills with title and placeholder text', () => {
      const tree = runSchematic({ name: 'nice', usePluginState: true });
      const fileContent = tree.readContent(`${pluginBasePath}/nice/README.md`);
      expect(fileContent).toContain(
        '# Nice Plugin' + '\n' + '\nProvide some info about your new plugin'
      );
    });
  });

  describe('pm-plugins/keymap.ts', () => {
    describe('when using keymaps', () => {
      it('generates file', () => {
        expect(runSchematic({ name: 'nice', useKeymap: true }).files).toContain(
          `${pluginBasePath}/nice/pm-plugins/keymap.ts`
        );
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', useKeymap: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/keymap.ts`
          );
          expect(fileContent).toContain(
            "import { keymap } from 'prosemirror-keymap';"
          );
          expect(fileContent).toContain(
            "import { bindKeymapWithCommand } from '../../keymaps';"
          );
        });

        it('creates keymap plugin', () => {
          const tree = runSchematic({ name: 'nice', useKeymap: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/keymap.ts`
          );
          expect(fileContent).toContain(
            'function keymapPlugin() {' +
              '\n  const list = {};' +
              '\n' +
              '\n  /**' +
              '\n   * Bind keyboard shortcuts to Prosemirror commands using bindKeymapWithCommon helper:' +
              '\n   *  bindKeymapWithCommand(keymap, command, list);' +
              '\n   */' +
              '\n' +
              '\n  return keymap(list);' +
              '\n}'
          );
        });

        it('exports keymap plugin', () => {
          const tree = runSchematic({ name: 'nice', useKeymap: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/keymap.ts`
          );
          expect(fileContent).toContain('export default keymapPlugin;');
        });
      });
    });

    describe('when not using keymaps', () => {
      it("doesn't generate file", () => {
        expect(runSchematic({ name: 'nice' }).files).not.toContain(
          `${pluginBasePath}/nice/pm-plugins/keymap.ts`
        );
      });
    });
  });

  describe('pm-plugins/input-rules.ts', () => {
    describe('when using input rules', () => {
      it('generates file', () => {
        expect(
          runSchematic({ name: 'nice', useInputRules: true }).files
        ).toContain(`${pluginBasePath}/nice/pm-plugins/input-rules.ts`);
      });

      describe('generating content', () => {
        it('imports types', () => {
          const tree = runSchematic({ name: 'nice', useInputRules: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/input-rules.ts`
          );
          expect(fileContent).toContain(
            "import { InputRule } from 'prosemirror-inputrules';"
          );
          expect(fileContent).toContain(
            "import { Plugin } from 'prosemirror-state';"
          );
          expect(fileContent).toContain(
            "import { createInputRule, instrumentedInputRule } from '../../../utils/input-rules';"
          );
        });

        it('creates input rules plugin', () => {
          const tree = runSchematic({ name: 'nice', useInputRules: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/input-rules.ts`
          );
          expect(fileContent).toContain(
            'function inputRulesPlugin(schema: Schema): Plugin | undefined {' +
              '\n  const rules: InputRule[] = [];' +
              '\n' +
              '\n  /**' +
              '\n   * Bind autoformatting rules to Prosemirror transactions using createInputRule helper:' +
              '\n   *  const rule = createInputRule(regex, (state, match, start, end) => tr);' +
              '\n   *  rules.push(rule);' +
              '\n   */' +
              '\n' +
              '\n  if (rules.length > 0) {' +
              "\n    return instrumentedInputRule('nice', { rules });" +
              '\n  }' +
              '\n' +
              '\n  return;' +
              '\n}'
          );
        });

        it('exports input rules plugin', () => {
          const tree = runSchematic({ name: 'nice', useInputRules: true });
          const fileContent = tree.readContent(
            `${pluginBasePath}/nice/pm-plugins/input-rules.ts`
          );
          expect(fileContent).toContain('export default inputRulesPlugin;');
        });
      });
    });

    describe('when not using input rules', () => {
      it("doesn't generate file", () => {
        expect(runSchematic({ name: 'nice' }).files).not.toContain(
          `${pluginBasePath}/nice/pm-plugins/input-rules.ts`
        );
      });
    });
  });

  describe('formatting plugin directory name', () => {
    it('formats name with spaces', () => {
      expect(runSchematic({ name: 'my awesome' }).files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });

    it('formats name with camel case', () => {
      expect(runSchematic({ name: 'MyAwesome' }).files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });

    it('strips off final word "plugin" if passed in', () => {
      expect(runSchematic({ name: 'my awesome plugin' }).files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });

    it('strips quotes', () => {
      expect(runSchematic({ name: '"my awesome"' }).files).toContain(
        `${pluginBasePath}/my-awesome/index.tsx`
      );
    });
  });

  describe('codemods for existing architecture', () => {
    it('adds export from index.ts', () => {
      const tree = runSchematic({ name: 'nice' });
      const fileContent = tree.readContent(`${pluginBasePath}/index.ts`);
      expect(fileContent).toContain(
        "export { default as existingPlugin } from './existing';"
      );
      expect(fileContent).toContain(
        "export { default as nicePlugin } from './nice';"
      );
    });
    it('adds import and function call into create-plugins-list.ts', () => {
      const tree = runSchematic({ name: 'nice' });
      const fileContent = tree.readContent(
        `${createEditorPath}/create-plugins-list.ts`
      );
      expect(fileContent).toContain(
        'import {' +
          '\n  existingPlugin,' +
          '\n  nicePlugin,' +
          "\n} from '../plugins';"
      );
      expect(fileContent).toContain('plugins.push(nicePlugin())');
    });
  });
});
