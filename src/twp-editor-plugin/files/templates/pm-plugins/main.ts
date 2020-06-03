import { Plugin } from 'prosemirror-state';
import { PMPluginFactoryParams } from '../../../types';
import { <%= camelize(name) %>PluginKey } from '../plugin-key';<% if (usePluginState) { %>
import { createPluginState } from './plugin-factory';
import { <%= classify(name) %>PluginState } from '../types';

const initialState: <%= classify(name) %>PluginState = {

};<% } %>

export const createPlugin = ({
  dispatch: Dispatch,
}: PMPluginFactoryParams) =>
  new Plugin({
    key: <%= camelize(name) %>PluginKey,<% if (usePluginState) { %>
    state: createPluginState(dispatch, initialState),<% } %>
    props: { /* props like nodeViews or decorations */ },
  });
