import { Reducer } from '../../../libraries/Store/Reducer.d'
import { Action } from '../../../libraries/Store/Action.d'
import { routerReducer } from './combine/routerReducer'
import { gameReducer } from './combine/gameReducer'
import { registerReducer } from './combine/registerReducer'
import { scoreReducer } from './combine/scoreReducer'

export const rootReducer: Reducer = (state: any, action: Action) => {
    let modifiedState = state
    modifiedState = {
        ...modifiedState,
        router: routerReducer(state.router, action),
    }
    modifiedState = {
        ...modifiedState,
        gameSettings: gameReducer(state.gameSettings, action),
    }
    modifiedState = {
        ...modifiedState,
        currentUser: registerReducer(state.currentUser, action),
    }
    modifiedState = {
        ...modifiedState,
        scoreTable: scoreReducer(state.scoreTable, action),
    }
    return modifiedState
}
