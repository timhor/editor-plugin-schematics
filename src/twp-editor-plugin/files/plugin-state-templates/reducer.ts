import { <%= classify(name) %>PluginState } from './types';
import { <%= classify(name) %>ActionTypes, <%= classify(name) %>Action } from './actions';

export function reducer(state: <%= classify(name) %>PluginState, action: <%= classify(name) %>Action): <%= classify(name) %>PluginState {
  switch(action.type) {
    default: return state;
  }
}