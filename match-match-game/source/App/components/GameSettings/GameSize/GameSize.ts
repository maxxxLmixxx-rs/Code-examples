import settingStyles from '../_share/Setting.module.scss'
import { store } from '../../../store/store'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { Component } from '../../../Component'
import { changeGameSize } from '../../../store/actions/actions'
import { HashRouter } from '../../../../libraries/HashRouter/HashRouter'
import { RouteGame } from '../../Router/Routes/RouteGame/RouteGame'
import { capture } from '../../../_share/_utilities/capture'

const className = classNameCreator(settingStyles)
const rawClassName = classNameCreator(settingStyles, true)

const sizeButton = (size: string, active = false) => `
    <button class="
        ${rawClassName('setting__btn')} ${active ? rawClassName('_js-active') : ''}
    " data-size="${size}">${size}x${size}</button>
`

export class GameSize extends Component {
    private activeSize = `${store.state.gameSettings.size}`
    private isDisabled = !store.state.currentUser.email

    static wasInitialized: {
        [prop: string]: boolean
    } = {}

    constructor(private props: { id: number, readonly: boolean, redirection: boolean }) {
        super()
        if (!GameSize.wasInitialized[props.id]) {
            GameSize.wasInitialized[props.id] = true
            document.addEventListener('click', this.clickEvent.bind(this))
        }
    }

    private clickEvent(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        const target = capture(`[data-size-container="${this.props.id}"]`, eventTarget)
        if (target) this.onGameSizeClick()
    }

    private onGameSizeClick() {
        if (store.state.gameSettings.gamePhase > 0) return
        if (this.props.readonly) return
        if (!store.state.currentUser.email) return
        const eventTarget = (window.event as MouseEvent).target as HTMLElement
        if (eventTarget.classList.contains(rawClassName('_js-active'))) return
        if (eventTarget.dataset.size) {
            store.dispatch(changeGameSize(Number(eventTarget.dataset.size)))
            if (this.props.redirection) HashRouter.route(RouteGame.route)
        }
    }

    getHtml(): string {
        return `
            <div data-size-container="${this.props.id}" class="
                 ${rawClassName('setting size')}
                 ${this.isDisabled ? rawClassName('_js-disabled') : ``}
                 "
            >
                <div ${className('setting__body', 'setting__body--center')}>
                    ${sizeButton('4', this.activeSize === '4')}
                    ${sizeButton('6', this.activeSize === '6')}
                    ${sizeButton('8', this.activeSize === '8')}
                </div>
                <div ${className('setting__footer')}>
                    <span ${className('setting__name')}>Change field size</span>
                </div>
            </div>
        `
    }
}
