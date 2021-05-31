import settingStyles from '../_share/Setting.module.scss'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { Component } from '../../../Component'
import { store } from '../../../store/store'
import { HashRouter } from '../../../../libraries/HashRouter/HashRouter'
import { RouteGame } from '../../Router/Routes/RouteGame/RouteGame'
import { changeGamePack } from '../../../store/actions/actions'
import { capture } from '../../../_share/_utilities/capture'

const className = classNameCreator(settingStyles)
const rawClassName = classNameCreator(settingStyles, true)

const packButton = (pack: string, active = false) => `
    <button class="${rawClassName('setting__btn')} ${active ? rawClassName('_js-active') : ''}"
        data-pack="${pack}">
        <img src="./cards/${pack}/1.svg"/>
    </button>
`

export class GamePack extends Component {
    private activePack = `${store.state.gameSettings.pack}`
    private isDisabled = !store.state.currentUser.email

    static wasInitialized: {
        [prop: string]: boolean
    } = {}

    constructor(private props: { id: number; readonly: boolean; redirection: boolean }) {
        super()
        if (!GamePack.wasInitialized[props.id]) {
            GamePack.wasInitialized[props.id] = true
            document.addEventListener('click', this.clickEvent.bind(this))
        }
    }

    private clickEvent(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        const target = capture(`[data-pack-container="${this.props.id}"]`, eventTarget)
        if (target) this.onGamePackClick()
    }

    private onGamePackClick() {
        if (store.state.gameSettings.gamePhase > 0) return
        if (this.props.readonly) return
        if (!store.state.currentUser.email) return
        const eventTarget = (window.event as MouseEvent).target as HTMLElement
        const targetParent = eventTarget.parentElement as HTMLElement
        if (targetParent.classList.contains(rawClassName('_js-active'))) return
        if (targetParent.dataset.pack) {
            store.dispatch(changeGamePack(Number(targetParent.dataset.pack)))
            if (this.props.redirection) HashRouter.route(RouteGame.route)
        }
    }

    getHtml(): string {
        return `
            <div data-pack-container="${this.props.id}" class="
                ${rawClassName('setting', 'pack')}
                ${this.isDisabled ? rawClassName('_js-disabled') : ``}
                "
            >
                <div ${className('setting__body', 'setting__body--center')}>
                    ${packButton('1', this.activePack === '1')}
                    ${packButton('2', this.activePack === '2')}
                    ${packButton('3', this.activePack === '3')}
                </div>
                <div ${className('setting__footer')}>
                    <span ${className('setting__name')}>Choose your cards pack</span>
                </div>
            </div>
        `
    }
}
