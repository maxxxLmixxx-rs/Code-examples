import { Action, ActionCreator } from '../Action'

type Constructor = new (...args: any[]) => any
export const StoreThunk = <T extends Constructor>(Target: T) => {
    if (!Target.prototype.dispatch) {
        throw new Error('Store has no dispatch method')
    }

    return class Store extends Target {
        constructor(...args: any[]) {
            console.log('Store decorator')
            super(...args)
        }

        dispatch(action: ActionCreator) {
            if (typeof action === 'function') action(super.dispatch.bind(this), this._state)
            if (typeof action === 'object') super.dispatch(action as Action)
        }
    }
}
