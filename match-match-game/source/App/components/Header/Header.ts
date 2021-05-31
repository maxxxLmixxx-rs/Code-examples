import { HashRouter } from '../../../libraries/HashRouter/HashRouter'
import { Component } from '../../Component'
import { changeGamePhase, changeRoute, pauseGame } from '../../store/actions/actions'
import { store } from '../../store/store'
import { RouteForm } from '../Router/Routes/RouteForm/RouteForm'
import { RouteGame } from '../Router/Routes/RouteGame/RouteGame'
import { HeaderView } from './HeaderView'

export class Header extends Component {
    private view: HeaderView

    constructor() {
        super()
        const {
            gameSettings: { pause, gamePhase },
            currentUser: { email, image },
            router: { locator },
        } = store.state

        this.view = new HeaderView({
            onRegisterClick() {
                store.dispatch(changeRoute(RouteForm.route, RouteForm.locator))
            },
            onStartGameClick() {
                if (store.state.gameSettings.pause) {
                    store.dispatch(pauseGame(false))
                } else {
                    store.dispatch(changeGamePhase(1))
                    HashRouter.route(RouteGame.route)
                }
            },
            onStopGameClick() {
                store.dispatch(pauseGame(true))
            },
            disabled: locator === RouteForm.locator,
            authorized: !!email,
            imageUrl: image,
            gamePhase,
            isPause: pause,
        })
    }

    getHtml() {
        return this.view.getHtml()
    }
}
