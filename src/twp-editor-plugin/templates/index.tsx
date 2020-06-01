import * as React from 'react';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const myNewPlugin = (): EditorPlugin => ({
  name: 'myNewPlugin',

  pmPlugins() {
    return [
      {
        name: 'myNewPlugin',
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

export default myNewPlugin;
