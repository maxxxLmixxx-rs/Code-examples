import rulesSettingsStyles from './styles/RulesSettings.module.scss'
import { classNameCreator } from '../../../../../_share/_utilities/class-name-creator'
import { Component } from '../../../../../Component'
import { Rule } from '../_share/_Rule'
import { GameSettings } from '../../../../GameSettings/GameSettings'

const className = classNameCreator(rulesSettingsStyles)

export class RulesSettings extends Component {
    static route: string
    static locator: string

    getHtml(): string {
        return `
            <div ${className('about', 'about-settings')}>
                <div ${className('about-settings__col-1')}>
                    <div ${className('about-settings__title')}>
                        ${Rule({ number: '2', innerText: 'Settings' })}
                    </div>
                    <div ${className('about__ruleset')}>
                        <div ${className('about__ruleset-heading')}>Size</div>
                        <div ${className('about__ruleset-group')}>
                            ${Rule({ number: '2.1', innerText: 'Change cards size' })}
                        </div>
                    </div>
                    <div ${className('about__ruleset')}>
                        <div ${className('about__ruleset-heading')}>Pack</div>
                        <div ${className('about__ruleset-group')}>
                            ${Rule({ number: '2.2', innerText: 'Choose your cards pack' })}
                        </div>
                    </div>
                </div>
                <div ${className('about-settings__col-2')}>
                    ${new GameSettings(2).getHtml()}
                </div>
            </div>
        `
    }
}

RulesSettings.route = '#/rules/settings'
RulesSettings.locator = 'Settings rules'
