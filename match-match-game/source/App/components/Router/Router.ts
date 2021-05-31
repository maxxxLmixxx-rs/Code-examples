import { Component } from '../../Component'
import { store } from '../../store/store'
import { RouterView } from './RouterView'
import { RouteForm } from './Routes/RouteForm/RouteForm'
import { RouteGame } from './Routes/RouteGame/RouteGame'
import { RulesGame } from './Routes/RouteRules/RulesGame/RulesGame'
import { RulesSettings } from './Routes/RouteRules/RulesSettings/RulesSettings'
import { RulesRegistration } from './Routes/RouteRules/RulesRegistration/RulesRegistration'
import { Modal } from '../Modal/Modal'
import { changeGamePhase } from '../../store/actions/actions'
import { GoToScore } from './Routes/GoTo/GoToScore'
import { GoToSettings } from './Routes/GoTo/GoToSettings'

export class Router extends Component {
    private view: RouterView

    constructor() {
        super()
        const { hash, locator } = store.state.router
        this.view = new RouterView({
            routeName: locator,
            routeHtml: this.getInnerElement(hash),
            modal: {
                element: new Modal({
                    message:
                        `Congratulations! You successfully finish all matches in ` +
                        `${store.state.currentUser.gameTime} minutes.`,
                    onsuccess: () => {
                        store.dispatch(changeGamePhase(0))
                    },
                }),
                condition: store.state.gameSettings.gamePhase === 2.1,
            },
        })
    }

    getHtml() {
        return this.view.getHtml()
    }

    private getInnerElement(hash: string): string {
        switch (hash) {
            case RulesRegistration.route:
                return new RulesRegistration().getHtml()
            case RulesSettings.route:
                return new RulesSettings().getHtml()
            case RulesGame.route:
                return new RulesGame().getHtml()
            case RouteForm.route:
                return new RouteForm().getHtml()
            case RouteGame.route:
                return new RouteGame().getHtml()
            case GoToScore.route:
                return new GoToScore().getHtml()
            case GoToSettings.route:
                return new GoToSettings().getHtml()
            default:
                return ''
        }
    }
}
