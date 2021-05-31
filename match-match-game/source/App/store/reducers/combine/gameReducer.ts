import { RuleLinkType } from '../../../components/RuleLinks/RuleLink/RuleLinkType.d'
import { Reducer } from '../../../../libraries/Store/Reducer'
import {
    CHANGE_GAME_PACK,
    CHANGE_GAME_PHASE,
    CHANGE_GAME_SIZE,
    PAUSE_GAME,
    SET_GAME_POSITIONS,
} from '../../actions/types'

// state.gameSettings
export const gameReducer: Reducer = (state, action: any) => {
    if (action.type === CHANGE_GAME_SIZE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (action.type === CHANGE_GAME_PACK) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (action.type === CHANGE_GAME_PHASE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (action.type === PAUSE_GAME) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (action.type === SET_GAME_POSITIONS) {
        return {
            ...state,
            cardIndexes: [...action.payload.cardIndexes],
        }
    }

    return state
}
