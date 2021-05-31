import { Component } from '../../../../Component'
import { store } from '../../../../store/store'
import { updateCurrentUser, setGamePositions, changeGamePhase } from '../../../../store/actions/actions'
import { RouteGameView } from './RouteGameView'
import { knuthShuffle } from './scripts/shuffle-array'
import { calculateScore, Parameters } from './scripts/calculate-score'
import { Timer } from '../../../Header/Timer/Timer'

export class RouteGame extends Component {
    private view: RouteGameView
    static route: string
    static locator: string
    static prevGamePhase = 0

    static MAX_PACK_SIZE = 50
    static MAX_GAME_SIZE = 8

    static state = Component.storageState({}, 'ROUTE_GAME_CARDS')

    constructor() {
        super()
        /** Stage 0 */
        super.onCreated(RouteGame, () => {
            store.dispatch(setGamePositions(this.getViewCards()))
        })
        /** Stage 1 */
        const { gamePhase, pause, size } = store.state.gameSettings
        if (gamePhase === 1 && RouteGame.prevGamePhase === 0) {
            RouteGame.prevGamePhase = gamePhase
            store.dispatch(setGamePositions(this.getShuffledCards(size)))
        }
        if (gamePhase === 0 && RouteGame.prevGamePhase === 2.1) {
            RouteGame.prevGamePhase = gamePhase
            store.dispatch(setGamePositions(this.getViewCards()))
        }
        const { pack, cardIndexes } = store.state.gameSettings
        this.view = new RouteGameView({
            pause,
            gamePhase,
            gameSize: size,
            gamePack: pack,
            gamePositions: cardIndexes,
            onGameEnd: this.onGameEnd.bind(this),
        })
        RouteGame.prevGamePhase = gamePhase
    }

    private onGameEnd(log: Parameters) {
        const [m, s] = Timer.state.currentTime.split(':').map(Number)
        const timeMs = (m * 60 + s) * 1000
        const score = calculateScore({ ...log, timeMs })
        store.dispatch(updateCurrentUser(score, (timeMs / 1000 / 60).toFixed(2)))
        store.dispatch(changeGamePhase(2.1))
    }

    getViewCards() {
        return Array.from({ length: RouteGame.MAX_GAME_SIZE ** 2 }).map((_, ix) => ix + 1)
    }

    private getShuffledCards(gameSize: number) {
        const unfilledArray = Array.from({ length: RouteGame.MAX_PACK_SIZE })
        const imageCollection = unfilledArray.map((_, ix) => ix + 1)
        const sortedCollection = knuthShuffle(imageCollection)
        const randomGameHalf = sortedCollection.slice(0, gameSize ** 2 / 2)
        return knuthShuffle([...randomGameHalf, ...randomGameHalf])
    }

    getHtml() {
        return this.view.getHtml()
    }
}

RouteGame.route = '#/game'
RouteGame.locator = 'Match-match game'
