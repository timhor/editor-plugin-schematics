import { InputRule } from 'prosemirror-inputrules';
import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { createInputRule, instrumentedInputRule } from '../../../utils/input-rules';

function inputRulesPlugin(schema: Schema): Plugin | undefined {
  const rules: InputRule[] = [];

  /**
   * Bind autoformatting rules to Prosemirror transactions using createInputRule helper:
   *  const rule = createInputRule(regex, (state, match, start, end) => tr);
   *  rules.push(rule);
   */

  if (rules.length !== 0) {
    return instrumentedInputRule('<%= dasherize(name) %>', { rules });
  }

  return;
}

export default inputRulesPlugin;
