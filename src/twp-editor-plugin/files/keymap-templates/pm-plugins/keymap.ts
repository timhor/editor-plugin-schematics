import { keymap } from 'prosemirror-keymap';
import { bindKeymapWithCommand } from '../../keymaps';

function keymapPlugin() {
  const list = {};

  /**
   * Bind keyboard shortcuts Prosemirror commands using bindKeymapWithCommon helper:
   *  bindKeymapWithCommand(keymap, command, list);
   */

  return keymap(list);
}

export default keymapPlugin;
