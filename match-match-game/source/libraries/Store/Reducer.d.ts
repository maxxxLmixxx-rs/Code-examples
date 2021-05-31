import { Action } from './Action.d'
export type Reducer = <T extends Object>(state: T, action: Action) => T
