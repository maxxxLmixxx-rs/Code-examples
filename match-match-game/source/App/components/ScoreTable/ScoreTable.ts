import { User } from '../../../libraries/Database/User.d'
import { Component } from '../../Component'
import { Score } from './Score/Score'
import { userDB } from '../../store/userDB'
import { setScoreTable } from '../../store/actions/actions'
import { store } from '../../store/store'

export class ScoreTable extends Component {
    static prevGamePhase = 0
    constructor() {
        super()
        super.onCreated(ScoreTable, () => {
            userDB
                .resolve()
                .then(() => userDB.getAll())
                .then((data) => {
                    if (data) store.dispatch(setScoreTable(data))
                })
        })
        if (ScoreTable.prevGamePhase === 2.1 && store.state.gameSettings.gamePhase === 0) {
            userDB
                .resolve()
                .then(() => userDB.getAll())
                .then((data) => {
                    if (data) store.dispatch(setScoreTable(data))
                })
        }
        ScoreTable.prevGamePhase = store.state.gameSettings.gamePhase
    }

    private sortCallback<T extends User>(userA: T, userB: T) {
        /// ** TO DELETE
        if (!userA) return +1
        return Number(userA.score) - Number(userB.score)
    }

    private getScoreComponent<T extends User>(user: T, ix: number) {
        const { score, image, email, firstName, lastName } = user
        return new Score({ position: ix + 1, score, image, email, name: `${firstName} ${lastName}` })
    }

    getHtml() {
        return `${store.state.scoreTable.users
            .sort(this.sortCallback)
            .map(this.getScoreComponent)
            .map((score) => score.getHtml())
            .join('')}`
    }
}
