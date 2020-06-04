import * as React from 'react';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';<% if (useKeymap) { %>
import keymapPlugin from './pm-plugins/keymap';<% } %><% if (useInputRules) { %>
import inputRulesPlugin from './pm-plugins/input-rules';<% } %>

const <%= camelize(name) %> = (): EditorPlugin => ({
  name: '<%= camelize(name) %>',

  pmPlugins() {
    return [
      {
        name: '<%= camelize(name) %>',
        plugin: (options) => createPlugin(options),
      },<% if (useKeymap) { %>
      {
        name: '<%= camelize(name) %>Keymap',
        plugin: () => keymapPlugin(),
      },<% } %><% if (useInputRules) { %>
      {
        name: '<%= camelize(name) %>InputRules',
        plugin: ({ schema }) => inputRulesPlugin(schema),
      },<% } %>
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
  }) {
    return <div>Plugin UI goes here</div>;
  },
});

export default <%= camelize(name) %>;
