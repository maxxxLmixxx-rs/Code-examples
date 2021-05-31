import routeGameStyles from './styles/RouteGame.module.scss'
import { classNameCreator } from '../../../../_share/_utilities/class-name-creator'
import { Component } from '../../../../Component'
import { capture } from '../../../../_share/_utilities/capture'
import errorImageUrl from '../../../../../assets/icons/error.svg'

const rawClassName = classNameCreator(routeGameStyles, true)

type Configuration = {
    gamePack: number
    gameSize: number
    gamePhase: number
    gamePositions: number[]
    onGameEnd: Function
    pause: boolean
}

const defaultProps: Configuration = {
    gamePack: 1,
    gameSize: 4,
    gamePhase: 0,
    gamePositions: [],
    onGameEnd: () => '',
    pause: false,
}

type PauseInterval = { start: Date; end: Date | null }

export class RouteGameView extends Component {
    private targets: HTMLElement[] = []
    private disableClick = false
    private disableInit = false
    static currentThis: {
        value: RouteGameView | null
    } = {
        value: null,
    }

    private logger = {
        initialTime: RouteGameView.state.initialTime,
        attemptTime: new Date(),
        attempts: 0,
        errors: 0,
        successes: 0,
    }

    static state = {
        initialTime: new Date(),
        wasPause: false,
        pause: false,
        innerHTML: '',
        pauseIntervals: [] as PauseInterval[],
        gamePhase: 0,
    }

    constructor(private props: Configuration = defaultProps) {
        super()
        RouteGameView.currentThis.value = this
        super.onCreated(RouteGameView, () => {
            document.addEventListener('click', this.gameBoardClick.bind(RouteGameView.currentThis))
        })
        this.props = {
            ...defaultProps,
            ...props,
        }
        RouteGameView.state.pause = this.props.pause
        RouteGameView.state.gamePhase = this.props.gamePhase
        /// INITIAL TIME
        if (this.props.gamePhase === 2 && !RouteGameView.state.wasPause) {
            RouteGameView.state.initialTime = new Date()
            this.logger.initialTime = RouteGameView.state.initialTime
        }
        /// PAUSE INTERVALS
        if (this.props.gamePhase === 2) {
            if (this.props.pause) {
                const pauses = RouteGameView.state.pauseIntervals
                pauses.push({ start: new Date(), end: null })
            }
            if (RouteGameView.state.wasPause && !this.props.pause) {
                const pauses = RouteGameView.state.pauseIntervals
                pauses[pauses.length - 1].end = new Date()
            }
        }
        /// INITIAL BOARD
        if (this.props.gamePhase === 2) {
            setTimeout(() => {
                this.saveCards()
                RouteGameView.state.wasPause = true
            })
        }
    }

    get gamePhase() {
        return this.props.gamePhase
    }

    private saveCards() {
        const gameBoard = document.getElementById('game-board') as HTMLElement
        RouteGameView.state.innerHTML = gameBoard.innerHTML
    }

    private isGameEnd() {
        if (this.logger.successes >= this.props.gameSize ** 2 / 2) {
            const attemptTime = this.logger.attemptTime.valueOf()
            const initialTime = this.logger.initialTime.valueOf()
            const gapTime = RouteGameView.state.pauseIntervals.reduce((gap: number, interval: PauseInterval) => {
                const end = interval.end ? interval.end.valueOf() : interval.start.valueOf()
                return gap + end - interval.start.valueOf()
            }, 0)
            RouteGameView.state = {
                wasPause: false,
                pause: false,
                innerHTML: '',
                gamePhase: 0,
                pauseIntervals: [],
                initialTime: new Date(),
            }
            this.props.onGameEnd({
                timeMs: attemptTime - initialTime - gapTime,
                attempts: this.logger.attempts,
                errors: this.logger.errors,
            })
        }
    }

    private writeLog(success: boolean) {
        this.logger.attempts += 1
        if (success) this.logger.successes += 1
        else this.logger.errors += 1
        this.logger.attemptTime = new Date()
    }

    /** Match-game utilities */

    private compareTargets() {
        const [target1, target2] = this.targets
        return target1.dataset.code === target2.dataset.code
    }

    private isFlipped(target: HTMLElement) {
        return target.classList.contains(rawClassName('_js-flipped'))
    }

    private toggleFlip(target: HTMLElement) {
        target.classList.toggle(rawClassName('_js-flipped'))
    }

    private toggleSuccess(target: HTMLElement) {
        target.classList.remove(rawClassName('_js-error'))
        target.classList.add(rawClassName('_js-success'))
    }

    private toggleError(target: HTMLElement) {
        target.classList.remove(rawClassName('_js-success'))
        target.classList.add(rawClassName('_js-error'))
        target.addEventListener(
            'animationend',
            () => {
                target.classList.remove(rawClassName('_js-error'))
            },
            { once: true }
        )
    }

    private onFlipEnd(target: HTMLElement, callback: Function) {
        target.addEventListener('transitionend', () => callback(), { once: true })
    }

    /** Event */

    private gameBoardClick(event: MouseEvent) {
        const target = capture(`.${rawClassName('card')}`, event.target as HTMLElement)
        if (RouteGameView.state.pause || RouteGameView.state.gamePhase !== 2) return
        if (target) {
            const currentThis = RouteGameView.currentThis.value
            if (currentThis?.disableInit) return
            currentThis?.cardsHandler.call(currentThis, target)
        }
    }

    private cardsHandler(target: HTMLElement) {
        if (this.isFlipped(target) || this.disableClick) return
        this.targets = [...this.targets, target]
        if (this.targets.length === 1) {
            this.toggleFlip(target)
        } else {
            this.disableClick = true
            const isPair = this.compareTargets()
            this.toggleFlip(target)
            this.onFlipEnd(target, () => {
                if (!isPair) this.targets.forEach(this.toggleFlip)
                this.targets = []
                this.disableClick = false
            })
            if (isPair) {
                this.targets.forEach(this.toggleSuccess)
                this.writeLog(true)
                this.saveCards()
                this.isGameEnd()
            } else {
                this.targets.forEach(this.toggleError)
                this.writeLog(false)
            }
        }
    }

    getHtml(): string {
        const { gameSize, gamePack } = this.props
        const isGameStart = !RouteGameView.state.wasPause && this.props.gamePhase === 2
        setTimeout(() => {
            if (isGameStart) {
                this.disableInit = true
                const gameBoard = document.getElementById('game-board')
                if (!gameBoard) this.disableInit = false
                else {
                    gameBoard.addEventListener('animationend', () => {
                        this.disableInit = false
                    }, { once: true })
                }
            }
        })
        return `
            <div id="game-board" class="
                ${rawClassName('game', `game--${gameSize}x${gameSize}`)}
                ${isGameStart ? rawClassName('_js-appear') : ''}
                "
            >
                ${
                    !RouteGameView.state.wasPause
                        ? (() =>
                              this.props.gamePositions
                                  .map((ix) => {
                                      return `
                            <div data-code="${ix}" class=" 
                                ${rawClassName('card')}
                                ${
                                    this.props.gamePhase < 2 || this.props.gamePhase === 2.1
                                        ? rawClassName('_js-flipped')
                                        : ''
                                }
                                "
                            ><div>
                            ${
                                ix <= 50
                                    ? `<img src="./cards/${gamePack}/${ix}.svg"/></div></div>`
                                    : `<img src="${errorImageUrl}"/></div></div>`
                            }
                        `
                                  })
                                  .join(''))()
                        : RouteGameView.state.innerHTML
                }
            </div>
        `
    }
}

// <div ${className('card', '_js-flipped')}><div><img src="./placeholder.png"/></div></div>
