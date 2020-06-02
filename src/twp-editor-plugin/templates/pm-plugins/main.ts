import { Plugin } from 'prosemirror-state';
import { PMPluginFactoryParams } from '../../../types';
import { pluginKey } from './plugin-key';<% if (usePluginState) { %>
import { createPluginState } from './plugin-factory';<% } %>

export const createPlugin = ({
  dispatch: Dispatch,
}: PMPluginFactoryParams) =>
  new Plugin({
    key: pluginKey,<% if (usePluginState) { %>
    state: createPluginState(dispatch, { /* initial state */ }),<% } %>
    props: { /* props like nodeViews or decorations */ },
  });
