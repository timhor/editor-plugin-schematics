import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PMPluginFactoryParams } from '../../../types';
import { <%= camelize(name) %>PluginKey } from '../plugin-key';<% if (usePluginState) { %>
import { createPluginState } from './plugin-factory';
import { <%= classify(name) %>PluginState } from '../types';

const initialState: <%= classify(name) %>PluginState = {

};<% } %>

export const createPlugin = ({
  dispatch,
}: PMPluginFactoryParams) =>
  new SafePlugin({
    key: <%= camelize(name) %>PluginKey,<% if (usePluginState) { %>
    state: createPluginState(dispatch, initialState),<% } %>
    props: { /* props like nodeViews or decorations */ },
  });
