// simulates packages/editor/editor-core/src/create-editor/create-plugins-list.ts

import {
  existingPlugin,
} from '../plugins';

export default function createPluginsList(
  props: EditorProps,
  prevProps?: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPlugin[] {
  const plugins = getDefaultPluginsList(props);

  if (props.allowExisting) {
    plugins.push(existingPlugin());
  }

  return plugins;
}
