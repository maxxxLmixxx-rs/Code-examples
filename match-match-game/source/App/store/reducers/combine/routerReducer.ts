import { Reducer } from '../../../../libraries/Store/Reducer'
import { CHANGE_ROUTE } from '../../actions/types'

// state.router
export const routerReducer: Reducer = (state, action: any) => {
    if (action.type === CHANGE_ROUTE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    return state
}
