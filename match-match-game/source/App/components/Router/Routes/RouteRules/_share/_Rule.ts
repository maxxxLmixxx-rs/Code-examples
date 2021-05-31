import aboutStyles from './_About.module.scss'
import { classNameCreator } from '../../../../../_share/_utilities/class-name-creator'

const className = classNameCreator(aboutStyles)
const rawClassName = classNameCreator(aboutStyles, true)

type Props = {
    number: string
    innerText: string
    ruleClassName?: string
}

export const Rule = ({ number, innerText, ruleClassName = '' }: Props): string => {
    return `
        <div class="${rawClassName('about__rule')} ${ruleClassName}">
            <span ${className('about__counter')}>${number}</span>
            <div ${className('about__text')}>${innerText}</div>
        </div>
    `
}
