import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { Schema } from 'prosemirror-model';
import { createRule, createPlugin } from '../../../utils/input-rules';

function inputRulesPlugin(schema: Schema): SafePlugin | undefined {
  const rules: InputRuleWrapper[] = [];

  /**
   * Bind autoformatting rules to Prosemirror transactions using createRule helper:
   *  const rule = createRule(regex, (state, matchResult, start, end) => tr);
   *  rules.push(rule);
   */

  if (rules.length > 0) {
    return createPlugin('<%= dasherize(name) %>', rules);
  }

  return;
}

export default inputRulesPlugin;
