import { <%= classify(name) %>PluginState } from './types';
import { <%= classify(name) %>ActionTypes, <%= classify(name) %>Action } from './actions';

export function reducer(state: <%= classify(name) %>PluginState, action: <%= classify(name) %>Action): <%= classify(name) %>PluginState {
  switch(action.type) {
    case <%= classify(name) %>ActionTypes.SOME_ACTION:
      return { ...state, /** new plugin state values go here **/ };

    default: return state;
  }
}
