import GoToStyles from './GoTo.module.scss'
import { Component } from '../../../../Component'
import { classNameCreator } from '../../../../_share/_utilities/class-name-creator'
import { GameSettings } from '../../../GameSettings/GameSettings'

const className = classNameCreator(GoToStyles)

export class GoToSettings extends Component {
    static route: string
    static locator: string

    getHtml(): string {
        return `
            <div ${className('goto-route')}>
                ${new GameSettings(1, { readonly: false }).getHtml()}
            </div>
        `
    }
}

GoToSettings.route = '#/settings'
GoToSettings.locator = 'Settings'
