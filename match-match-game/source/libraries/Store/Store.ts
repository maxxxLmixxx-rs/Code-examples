import { Action, ActionCreator } from './Action.d'

import { Reducer } from './Reducer.d'
import { StoreLogger } from './middleware/StoreLogger'
import { StoreThunk } from './middleware/StoreThunk'

interface StoreType {
    dispatch(action: ActionCreator): void
    subscribe(callback: Function): void
}

@StoreLogger
@StoreThunk
export class Store<T, K extends Object> implements StoreType {
    private _state: K
    private subscribers: Function[] = []

    constructor(private rootReducer: Reducer, initialState: K) {
        this._state = rootReducer(initialState, { type: '@@INIT' })
    }

    get state(): K {
        return this._state
    }

    dispatch(action: Action | any) {
        this._state = this.rootReducer(this._state, action)
        this.subscribers.forEach((callback) => callback())
    }

    subscribe(callback: Function) {
        const isAdded = this.subscribers.some((c) => c === callback)
        if (!isAdded) this.subscribers.push(callback)
    }
}
