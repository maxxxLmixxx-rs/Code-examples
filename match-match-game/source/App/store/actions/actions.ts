import { userDB } from '../userDB'
import { User } from '../../../libraries/Database/User.d'
import {
    CHANGE_GAME_PACK,
    CHANGE_GAME_PHASE,
    CHANGE_GAME_SIZE,
    CHANGE_ROUTE,
    PAUSE_GAME,
    REGISTER_NEW_PLAYER,
    SET_GAME_POSITIONS,
    SET_SCORE_TABLE,
    UPDATE_USER_SCORE,
} from './types'

export const changeRoute = (hash: string, locator: string) => {
    return {
        type: CHANGE_ROUTE,
        payload: { hash, locator },
    }
}

export const changeGameSize = (size: number) => {
    const [min, max] = [4, 8]
    if (size < min || size > max) {
        throw new Error(`Size '${size}' should satisfy interval: [${min}, ${max}]`)
    }
    return {
        type: CHANGE_GAME_SIZE,
        payload: { size },
    }
}

export const changeGamePack = (pack: number) => {
    const [min, max] = [1, 3]
    if (pack < min || pack > max) {
        throw new Error(`Pack '${pack}' should satisfy interval: [${min}, ${max}]`)
    }
    return {
        type: CHANGE_GAME_PACK,
        payload: { pack },
    }
}

// export const flipGameCards = (flipped: boolean) => {
//     return {
//         type: FLIP_GAME_CARDS,
//         payload: { flipped },
//     }
// }

export const setGamePositions = (cardIndexes: number[]) => {
    return {
        type: SET_GAME_POSITIONS,
        payload: { cardIndexes },
    }
}

const validateUser = (user: User) => {
    if (!user.lastName || !user.firstName || !user.email) {
        throw new Error(`Object has unfilled properties:\n ${JSON.stringify(user, null, 2)}`)
    }
}

export const registerPlayer = (user: User) => {
    return (dispatch: Function) => {
        localStorage.setItem('STORAGE_EMAIL', user.email)
        userDB.put({ ...user, score: '0' }).then(() => {
            dispatch({
                type: REGISTER_NEW_PLAYER,
                payload: { ...user, score: '0' },
            })
        })
    }
}

export const updateCurrentUser = (score: number, time: string) => {
    return (dispatch: Function, state: any) => {
        const user = state.currentUser
        // localStorage.setItem('STORAGE_EMAIL', user.email)
        userDB.put({ ...user, score }).then(() => {
            dispatch({
                type: UPDATE_USER_SCORE,
                payload: { score, gameTime: time },
            })
        })
    }
}

export const setScoreTable = (users: User[]) => {
    return {
        type: SET_SCORE_TABLE,
        payload: { users },
    }
}

export const changeGamePhase = (gamePhase: number) => {
    return {
        type: CHANGE_GAME_PHASE,
        payload: { gamePhase },
    }
}

export const pauseGame = (pause: boolean) => {
    return {
        type: PAUSE_GAME,
        payload: { pause },
    }
}
