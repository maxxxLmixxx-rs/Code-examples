import { Component } from '../../Component'
import { RuleLinkType } from './RuleLink/RuleLinkType'
import { RuleLink } from './RuleLink/RuleLink'
import { RulesRegistration } from '../Router/Routes/RouteRules/RulesRegistration/RulesRegistration'
import { RulesGame } from '../Router/Routes/RouteRules/RulesGame/RulesGame'
import { RulesSettings } from '../Router/Routes/RouteRules/RulesSettings/RulesSettings'
import { store } from '../../store/store'

type Configuration = {
    ruleLinks: RuleLinkType[]
}

const defaultProps: () => Configuration = () => ({
    ruleLinks: [
        {
            route: RulesRegistration.route,
            ruleNumber: '1',
            innerText: 'Register new player in game.',
            readonly: store.state.gameSettings.gamePhase > 0,
            active: store.state.router.hash === RulesRegistration.route,
        },
        {
            route: RulesSettings.route,
            ruleNumber: '2',
            innerText: 'Configure your game settings.',
            readonly: store.state.gameSettings.gamePhase > 0,
            active: store.state.router.hash === RulesSettings.route,
        },
        {
            route: RulesGame.route,
            ruleNumber: '3',
            innerText: 'Start you new game! Remember card positions and match it before times up.',
            readonly: store.state.gameSettings.gamePhase > 0,
            active: store.state.router.hash === RulesGame.route,
        },
    ],
})

export class RuleLinks extends Component {
    private props: Required<Configuration> = defaultProps()
    getHtml(): string {
        return `
            ${this.props.ruleLinks.map((props) => new RuleLink(props).getHtml()).join('')}
        `
    }
}
