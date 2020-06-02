export enum <%= classify(name) %>ActionTypes {
  SOME_ACTION = 'SOME_ACTION'
}

export interface Some<%= classify(name) %>Action {
  type: <%= classify(name) %>ActionTypes.SOME_ACTION
}

export type <%= classify(name) %>Action = Some<%= classify(name) %>Action;
