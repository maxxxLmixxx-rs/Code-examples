import ruleLinkStyles from './styles/RuleLink.module.scss'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { Component } from '../../../Component'
import { RuleLinkType } from './RuleLinkType.d'

const className = classNameCreator(ruleLinkStyles)
const rawClassName = classNameCreator(ruleLinkStyles, true)

type Configuration = RuleLinkType
export class RuleLink extends Component {
    constructor(private props: Configuration) {
        super()
    }

    getHtml(): string {
        return `
            <a ${this.props.readonly ? '' : `href="${this.props.route}"`} class="
               ${rawClassName('rule-link')}
               ${this.props.active ? rawClassName('_js-active') : ''}"
            >
                <span ${className('_num rule-link__number')}>${this.props.ruleNumber}</span>
                <p ${className('rule-link__description')}>${this.props.innerText}</p>
            </a>
        `
    }
}
