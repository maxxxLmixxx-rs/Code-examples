import { Reducer } from '../../../../libraries/Store/Reducer'
import { SET_SCORE_TABLE } from '../../actions/types'

// state.scoreTable
export const scoreReducer: Reducer = (state, action: any) => {
    if (action.type === SET_SCORE_TABLE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    return state
}
