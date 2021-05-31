import GoToStyles from './GoTo.module.scss'
import { Component } from '../../../../Component'
import { classNameCreator } from '../../../../_share/_utilities/class-name-creator'
import { ScoreTable } from '../../../ScoreTable/ScoreTable'

const className = classNameCreator(GoToStyles)

export class GoToScore extends Component {
    static route: string
    static locator: string

    getHtml(): string {
        return `
            <div ${className('goto-route')}>
                ${new ScoreTable().getHtml()}
            </div>
        `
    }
}

GoToScore.route = '#/leader-board'
GoToScore.locator = 'Leader board'
