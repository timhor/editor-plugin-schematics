import * as React from 'react';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const <%= formattedName.camel %> = (): EditorPlugin => ({
  name: '<%= formattedName.camel %>',

  pmPlugins() {
    return [
      {
        name: '<%= formattedName.camel %>',
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

export default <%= formattedName.camel %>;
