import { Reducer } from '../../../../libraries/Store/Reducer'
import { REGISTER_NEW_PLAYER, UPDATE_USER_SCORE } from '../../actions/types'

// state.currentUser
export const registerReducer: Reducer = (state, action: any) => {
    if (action.type === REGISTER_NEW_PLAYER) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (action.type === UPDATE_USER_SCORE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    return state
}
