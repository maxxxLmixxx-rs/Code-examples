import asideStyles from './styles/Aside.module.scss'
import { classNameCreator } from '../../_share/_utilities/class-name-creator'
import { Component } from '../../Component'
import { RuleLinks } from '../RuleLinks/RuleLinks'
import { capture } from '../../_share/_utilities/capture'
import { ScoreTable } from '../ScoreTable/ScoreTable'
import { GameSettings } from '../GameSettings/GameSettings'
import { WorkspaceType } from './Workspace/Workspace.d'
import { Workspace } from './Workspace/Workspace'
import { RulesRegistration } from '../Router/Routes/RouteRules/RulesRegistration/RulesRegistration'

const className = classNameCreator(asideStyles)
const rawClassName = classNameCreator(asideStyles, true)

type Configuration = {
    asideItems: WorkspaceType[]
}

const defaultProps: () => Configuration = () => ({
    asideItems: [
        {
            menuName: 'Leader Board',
            gotoLink: '#/leader-board',
            innerHtml: new ScoreTable().getHtml(),
        },
        {
            menuName: 'Settings',
            gotoLink: '#/settings',
            innerHtml: new GameSettings(0, { redirection: true, readonly: false }).getHtml(),
        },
        {
            menuName: 'Rules',
            gotoLink: RulesRegistration.route,
            innerHtml: new RuleLinks().getHtml(),
        },
    ],
})

export class Aside extends Component {
    static activeWorkspaces = [false, false, false]
    private props: Required<Configuration> = defaultProps()

    constructor() {
        super()
        super.onCreated(Aside, () => {
            document.addEventListener('click', this.choseWorkspaceClick)
        })
    }

    private choseWorkspaceClick(event: MouseEvent): void {
        const captureQuery = `.${rawClassName('explorer__label')}`
        const eventTarget = event.target as HTMLElement
        const captured = capture(captureQuery, eventTarget)

        const isButtonElement = (target: HTMLElement): boolean => {
            return target.classList.contains(rawClassName('_btn'))
        }

        if (captured && !isButtonElement(eventTarget)) {
            const asideItem = captured.parentElement as HTMLElement
            const asideCollection = (asideItem.parentElement as HTMLElement).children
            asideItem.classList.toggle(rawClassName('_js-active'))

            const index = [...asideCollection].findIndex((element) => {
                return element === asideItem
            })
            Aside.activeWorkspaces[index] = !Aside.activeWorkspaces[index]
        }
    }

    getHtml() {
        return `
            <aside ${className('explorer')}>
                ${this.props.asideItems
                    .map((item, ix) => Workspace({ ...item, active: Aside.activeWorkspaces[ix] }))
                    .join('')}
            </aside>
        `
    }
}
