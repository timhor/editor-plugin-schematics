// simulates packages/editor/editor-core/src/create-editor/create-plugins-list.ts

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import {
  existingPlugin,
} from '../plugins';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { ScrollGutterPluginOptions } from '../plugins/base/pm-plugins/scroll-gutter';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { PrivateCollabEditOptions } from '../plugins/collab-edit/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import { createDefaultPreset } from '../labs/next/presets/default';

function getScrollGutterOptions(
  props: EditorProps,
): ScrollGutterPluginOptions | undefined {}

export function getDefaultPresetOptionsFromEditorProps(props: EditorProps) {
  return {};
}

/**
 * Maps EditorProps to EditorPlugins
 */
export default function createPluginsList(
  props: EditorProps,
  prevProps?: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPlugin[] {
  const preset = createDefaultPreset(
    getDefaultPresetOptionsFromEditorProps(props),
  );

  if (props.allowExisting) {
    preset.add(existingPlugin);
  }

  const excludes = new Set<string>();

  return preset.getEditorPlugins(excludes);
}
