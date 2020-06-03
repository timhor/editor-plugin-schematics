import * as React from 'react';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const <%= camelize(name) %> = (): EditorPlugin => ({
  name: '<%= camelize(name) %>',

  pmPlugins() {
    return [
      {
        name: '<%= camelize(name) %>',
        plugin: (options) => createPlugin(options),
      },
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
