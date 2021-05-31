import { Store } from '../../libraries/Store/Store'
import { rootReducer } from './reducers/rootReducer'

export const store = new Store(rootReducer, {
    router: {
        locator: 'Placeholder',
        hash: '#',
    },
    gameSettings: {
        /** 0 -> NO GAME | 1 -> REMEMBER | 2 -> GAME | 2.1 -> modal */
        gamePhase: 0,
        pause: false,
        cardIndexes: [],
        size: 4,
        pack: 1,
    },
    currentUser: {
        /** email indicates log-in state */
        email: localStorage.getItem('STORAGE_EMAIL') || null,
        firstName: null,
        lastName: null,
        score: null,
        image: null,
        gameTime: null,
    },
    scoreTable: {
        users: [],
    },
})
