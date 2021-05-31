import rulesRegistrationStyles from './styles/RulesRegistration.module.scss'
import { classNameCreator } from '../../../../../_share/_utilities/class-name-creator'
import { Component } from '../../../../../Component'
import { RouteForm } from '../../RouteForm/RouteForm'
import { Rule } from '../_share/_Rule'

const className = classNameCreator(rulesRegistrationStyles)

export class RulesRegistration extends Component {
    static route: string
    static locator: string

    getHtml(): string {
        return `
            <div ${className('about', 'about-registration')}>
                <div ${className('about-registration__row-1')}>
                    <div ${className('about-registration__col-1')}>
                        <div ${className('about-registration__title')}>
                            ${Rule({ number: '1', innerText: 'Registration' })}
                        </div>
                        <button ${className('_btn', '_btn--mp', '_btn--dark', '_btn--round')}>Register</button>
                        <div ${className('about__ruleset')}>
                            <div ${className('about__ruleset-heading')}>First/Last name</div>
                            <div ${className('about__ruleset-group')}>
                                ${Rule({ number: '1.1', innerText: 'Cannot be empty' })}
                                ${Rule({ number: '1.2', innerText: 'Only alphabet symbols' })}
                                ${Rule({ number: '1.3', innerText: 'Only one word' })}
                            </div>
                        </div>
                    </div>
                    <div ${className('about-registration__col-2')}>
                        ${new RouteForm().getHtml()}
                    </div>
                </div>
                <div ${className('about-registration__row-2')}>
                    <div ${className('about__ruleset')}>
                        <div ${className('about__ruleset-heading')}>Email</div>
                        <div ${className('about__ruleset-group')}>
                            ${Rule({ number: '1.4', innerText: 'Cannot be empty' })}
                            <div ${className('about__rule')}>
                                <span ${className('about__counter')}>1.5</span>
                                <div ${className('about__text')}>Must be <a ${className('about__link')} target="_blank"
                                    href="https://datatracker.ietf.org/doc/html/rfc5322"
                                    >RFC5322</a> compliant
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

RulesRegistration.route = '#/rules/registration'
RulesRegistration.locator = 'Registration rules'
