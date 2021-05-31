import { Component } from '../../../../Component'
import { store } from '../../../../store/store'
import { registerPlayer } from '../../../../store/actions/actions'
import { User } from '../../../../../libraries/Database/User.d'
import { RouteFormView } from './RouteFormView'
import { emailValidation, nameValidation } from './scripts/validator'
import { HashRouter } from '../../../../../libraries/HashRouter/HashRouter'
import { RouteGame } from '../RouteGame/RouteGame'

export class RouteForm extends Component {
    static route: string
    static locator: string
    private view: RouteFormView

    constructor() {
        super()
        this.view = new RouteFormView({
            readonly: store.state.router.hash !== RouteForm.route,
            validateEmail: emailValidation,
            validateName: nameValidation,
            registerPlayer: (user: User) => {
                console.log(user)
                store.dispatch(registerPlayer(user))
                HashRouter.route(RouteGame.route)
            },
        })
    }

    getHtml(): string {
        return this.view.getHtml()
    }
}

RouteForm.route = '#/registration'
RouteForm.locator = 'Registration'
