// simulates packages/editor/editor-core/src/labs/next/presets/default.tsx

// #region Imports
import React from 'react';
import existingPlugin from '../../../plugins/scroll-into-view';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { Preset } from './preset';
import { EditorPlugin } from '../../../types/editor-plugin';
// #endregion

interface EditorPresetDefaultProps {
  children?: React.ReactNode;
}

export function useDefaultPreset({ featureFlags }: EditorPresetProps) {
  const preset = new Preset<EditorPlugin>();
  preset.add(existingPlugin);
  return [preset];
}

export function EditorPresetDefault(
  props: EditorPresetDefaultProps & EditorPresetProps,
) {
  const [preset] = useDefaultPreset(props);
  const plugins = preset.getEditorPlugins();

  return <PresetProvider value={plugins}>{props.children}</PresetProvider>;
}
