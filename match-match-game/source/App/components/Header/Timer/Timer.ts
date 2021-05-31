import timerStyles from './Timer.module.scss'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { Component } from '../../../Component'
import { store } from '../../../store/store'
import { changeGamePhase } from '../../../store/actions/actions'

const className = classNameCreator(timerStyles)

type Ticker = () => void | '@@EXIT'
export class Timer extends Component {
    static gamePhase: number
    static wasPause: boolean
    static tickers: Array<Ticker | null> = []
    static state = Component.storageState(
        {
            currentTime: '00:00',
        },
        'TIMER_STATE'
    ) as { currentTime: string }

    private state = Timer.state

    constructor() {
        super()
        super.onCreated(Timer, () => {
            this.createTicker(1000)()
        })

        Timer.gamePhase = store.state.gameSettings.gamePhase

        if (store.state.gameSettings.pause) {
            Timer.tickers = []
            Timer.wasPause = true
            return
        }

        if (Timer.gamePhase === 0 || Timer.gamePhase === 2.1) {
            Timer.tickers = []
            this.updateTime('00:00')
        }

        if (Timer.gamePhase === 1) {
            Timer.tickers[2] = null
            this.updateTime('00:10')
            Timer.tickers[1] = () => {
                const decremented = this.getDecremented()
                this.updateTime(decremented)
                if (decremented === '00:00') {
                    setTimeout(() => {
                        store.dispatch(changeGamePhase(2))
                    })
                }
            }
        }

        if (Timer.gamePhase === 2) {
            Timer.tickers[1] = null
            if (!Timer.wasPause) this.updateTime('00:00')
            Timer.wasPause = false
            Timer.tickers[2] = () => {
                const incremented = this.getIncremented()
                this.updateTime(incremented)
            }
        }
    }

    private updateTime(time: string) {
        const timerElement = document.getElementById('game-timer')
        if (!timerElement) return
        timerElement.innerText = time
        this.state.currentTime = time
    }

    private stringify(min: number, sec: number) {
        const normalize = (n: number) => (n < 10 ? `0${n}` : n)
        return `${normalize(min)}:${normalize(sec)}`
    }

    private getIncremented() {
        const time = this.state.currentTime
        const [m, s] = time.split(':').map(Number)
        const newS = s >= 60 ? 0 : s + 1
        const newM = s >= 60 ? m + 1 : m
        return time === '60:00' ? time : this.stringify(newM, newS)
    }

    private getDecremented() {
        const time = this.state.currentTime
        const [m, s] = time.split(':').map(Number)
        const newS = s < 1 ? 59 : s - 1
        const newM = s < 1 ? m - 1 : m
        return time === '00:00' ? time : this.stringify(newM, newS)
    }

    private createTicker(intervalMs: number) {
        return function ticker() {
            setTimeout(() => {
                const codes = Timer.tickers.map((func) => (func ? func() : null))
                if (codes.some((c) => c === '@@EXIT')) return
                ticker()
            }, intervalMs)
        }
    }

    getHtml() {
        return `
            <time id="game-timer" ${className('timer')}>${this.state.currentTime}</time>
        `
    }
}
