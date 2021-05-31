import headerStyles from './styles/Header.module.scss'
import { classNameCreator } from '../../_share/_utilities/class-name-creator'
import { Component } from '../../Component'
import { capture } from '../../_share/_utilities/capture'
import avatar from '../../../assets/icons/avatar.svg'
import { Timer } from './Timer/Timer'
import { RouteForm } from '../Router/Routes/RouteForm/RouteForm'

const className = classNameCreator(headerStyles)
const rawClassName = classNameCreator(headerStyles, true)

type Configuration = {
    onStartGameClick?: () => any
    onStopGameClick?: () => any
    onRegisterClick?: () => any
    authorized: boolean
    disabled: boolean
    gamePhase: number
    isPause: boolean
    imageUrl?: string | null
}

const defaultProps = {
    onStartGameClick: () => '',
    onRegisterClick: () => '',
    onStopGameClick: () => '',
    imageUrl: avatar,
}

export class HeaderView extends Component {
    private props: Required<Configuration>
    constructor(params: Configuration) {
        super()
        super.onCreated(HeaderView, () => {
            document.addEventListener('click', this.registerClickHandler.bind(this))
        })
        this.props = {
            ...defaultProps,
            ...params,
            imageUrl: params.imageUrl ? params.imageUrl : defaultProps.imageUrl,
        }
    }

    private registerClickHandler(event: MouseEvent): void {
        const targetElement = event.target as HTMLElement
        switch (true) {
            case !!capture('#new-player', targetElement):
                this.props.onRegisterClick()
                break
            case !!capture('#start-game', targetElement):
                this.props.onStartGameClick()
                break
            case !!capture('#stop-game', targetElement):
                this.props.onStopGameClick()
                break
            default:
        }
    }

    getHtml(): string {
        return `
            <header class="
                ${rawClassName('header')} 
                ${this.props.disabled ? rawClassName('_js-disabled') : ''}
            ">
                <div ${className('header__block-1')}>
                    ${!this.props.authorized ? `` : new Timer().getHtml()}
                </div>
                <div ${className('header__block-2')}>
                    ${
                        !this.props.authorized
                            ? `<button id="new-player" ${className('_btn', '_btn--mp', '_btn--dark', '_btn--round')}
                            >Register new player</button>`
                            : `${
                                  this.props.gamePhase < 2 || this.props.isPause
                                      ? `<button id="start-game" ${className(
                                            '_btn',
                                            '_btn--mp',
                                            '_btn--dark',
                                            '_btn--round'
                                        )}
                                >Start game</button>`
                                      : `<button id="stop-game" ${className(
                                            '_btn',
                                            '_btn--mp',
                                            '_btn--dark',
                                            '_btn--round'
                                        )}
                                >Stop game</button>`
                              }
                            <a ${this.props.gamePhase > 0 ? '' : `href="${RouteForm.route}"`}>
                                <img ${className('header__avatar')} height="65" src="${this.props.imageUrl}" alt=""/>
                            </a>`
                    }
                </div>
            </header>
        `
    }
}
