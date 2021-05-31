import scoreStyles from './styles/Score.module.scss'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { Component } from '../../../Component'
import avatar from '../../../../assets/icons/avatar.svg'

const className = classNameCreator(scoreStyles)

type ScoreType = Partial<{
    position: string | number
    score: string | number
    image: string
    email: string
    name: string
}>

const defaultProps: ScoreType = {
    email: 'bot@gmail.com',
    name: 'Bot 1',
    score: 0,
    position: -1,
}

export class Score extends Component {
    constructor(public props: ScoreType = defaultProps) {
        super()
        this.props = {
            ...defaultProps,
            ...props,
        }
    }

    getHtml() {
        return `
            <div ${className('user-score')}>
                <div ${className('user-score__left')}>
                    <img ${className('user-score__img')} src="${this.props.image || avatar}" alt="avatar">
                    <div ${className('user-score__personal')}>
                        <span ${className('user-score__name')} 
                            title="${this.props.name}"
                        >${this.props.name}</span>
                        <span ${className('user-score__email')} 
                            title="${this.props.email}"
                        >${this.props.email}</span>
                    </div>
                </div>
                <div ${className('user-score__right')}>
                    <span ${className('user-score__points')}>SCORE: <span>${this.props.score}</span></span>
                    <span ${className('_num', 'user-score__position')}>${this.props.position}</span>
                </div>
            </div>
        `
    }
}
