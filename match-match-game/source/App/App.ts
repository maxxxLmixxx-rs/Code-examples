import appStyles from './styles/App.module.scss'
import { classNameCreator } from './_share/_utilities/class-name-creator'
import { Component } from './Component'
import { store } from './store/store'
import { Header } from './components/Header/Header'
import { Router } from './components/Router/Router'
import { Aside } from './components/Aside/Aside'
/** ROUTES */
import { changeRoute, registerPlayer } from './store/actions/actions'
import { RulesSettings } from './components/Router/Routes/RouteRules/RulesSettings/RulesSettings'
import { RouteGame } from './components/Router/Routes/RouteGame/RouteGame'
import { RouteForm } from './components/Router/Routes/RouteForm/RouteForm'
import { RulesGame } from './components/Router/Routes/RouteRules/RulesGame/RulesGame'
import { HashRouter } from '../libraries/HashRouter/HashRouter'
import { RulesRegistration } from './components/Router/Routes/RouteRules/RulesRegistration/RulesRegistration'
import { userDB } from './store/userDB'
import { GoToSettings } from './components/Router/Routes/GoTo/GoToSettings'
import { GoToScore } from './components/Router/Routes/GoTo/GoToScore'

const className = classNameCreator(appStyles)

export interface Static<TClass> {
    new (): TClass
    route: string
    locator: string
}

const Route = <T>(RouteClass: Static<T>) => ({
    hashes: [RouteClass.route],
    callback: () => {
        store.dispatch(changeRoute(RouteClass.route, RouteClass.locator))
    },
})

export class App extends Component {
    static STORAGE_EMAIL: string
    static state = Component.storageState(
        {
            currentRoute: RouteForm.route,
        },
        'APP_STATE'
    )

    constructor() {
        super()
        App.state.currentRoute = location.hash || App.state.currentRoute
        super.onCreated(App, () => {
            HashRouter.put(Route(RulesRegistration))
                .put(Route(RulesSettings))
                .put(Route(RulesGame))
                .put(Route(RouteForm))
                .put(Route(RouteGame))
                .put(Route(GoToScore))
                .put(Route(GoToSettings))
                .route(App.state.currentRoute)
            const { email } = store.state.currentUser
            if (email) {
                userDB.get(email).then((user) => {
                    store.dispatch(registerPlayer(user))
                })
            }
        })
    }

    getHtml(): string {
        return `
            <div ${className('app-grid')}>
                ${new Header().getHtml()}
                ${new Router().getHtml()}
                ${new Aside().getHtml()}
            </div>
        `
    }
}
