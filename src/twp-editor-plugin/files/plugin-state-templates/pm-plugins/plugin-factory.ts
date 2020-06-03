import { pluginFactory } from '../../utils/plugin-state-factory';
import { <%= camelize(name) %>PluginKey } from '../plugin-key';
import { <%= classify(name) %>PluginState } from '../types';
import { reducer } from '../reducer';

export const {
  createCommand,
  getPluginState,
  createPluginState,
} = pluginFactory(<%= camelize(name) %>PluginKey, reducer, /** { mapping, onDocChanged, onSelectionChanged } **/);
