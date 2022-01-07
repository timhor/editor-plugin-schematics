import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand } from '../../../keymaps';

function keymapPlugin() {
  const list = {};

  /**
   * Bind keyboard shortcuts to Prosemirror commands using bindKeymapWithCommon helper:
   *  bindKeymapWithCommand(keymap, command, list);
   */

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
