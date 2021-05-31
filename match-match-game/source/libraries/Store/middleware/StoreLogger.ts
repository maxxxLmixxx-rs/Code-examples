import { Action, ActionCreator } from '../Action'

type Constructor = new (...args: any[]) => any
export const StoreLogger = <T extends Constructor>(Target: T) => {
    return class Store extends Target {
        constructor(...args: any[]) {
            super(...args)
            ;(window as { [key: string]: any }).store = this
            console.warn('Store can be accessed through window.store')
        }

        // dispatch(action: ActionCreator) {
        //     const isFunction = Object.getPrototypeOf(action) === Function.prototype
        //     console.log(isFunction ? action : (action as Action).type, this._state)
        //     super.dispatch(action)
        //     console.log(isFunction ? action : (action as Action).type, this._state)
        // }

        dispatch(action: ActionCreator) {
            console.log(action)
            super.dispatch(action)
        }
    }
}
