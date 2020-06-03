<% if (usePluginState) { %>
import { createCommand } from './pm-plugins/plugin-factory';
import { <%= classify(name) %>ActionTypes } from './actions';

export const someCommand = () =>
  createCommand({
    type: <%= classify(name) %>ActionTypes.SOME_ACTION,
  });
<% } %>