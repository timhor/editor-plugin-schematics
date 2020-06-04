import { keymap } from 'prosemirror-keymap';
import { bindKeymapWithCommand } from '../../keymaps';

const keymapPlugin = () => {
  const list = {};
  /**
   * Bind any keyboard shortcuts you need to Prosemirror commands like:
   *  bindKeymapWithCommand(keymap, command, list);
   */
  return keymap(list);
};

export default keymapPlugin;
