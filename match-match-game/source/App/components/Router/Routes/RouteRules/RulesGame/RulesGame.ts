import rulesGameStyles from './styles/RulesGame.module.scss'
import { classNameCreator } from '../../../../../_share/_utilities/class-name-creator'
import { Component } from '../../../../../Component'
import { Rule } from '../_share/_Rule'

const className = classNameCreator(rulesGameStyles)

export class RulesGame extends Component {
    static route: string
    static locator: string

    getHtml(): string {
        return `
            <div ${className('about', 'about-game')}>
                <div ${className('about-game__title')}>
                    ${Rule({ number: '3', innerText: 'Game rules' })}
                </div>
                <div ${className('about__ruleset')}>
                    <div ${className('about__ruleset-heading')}>Memorize</div>
                    <div ${className('about__ruleset-group')}>
                        ${Rule({ number: '3.1', innerText: 'Before start you have 30 seconds to memorize all cards.' })}
                    </div>
                </div>
                <div ${className('about__ruleset')}>
                    <div ${className('about__ruleset-heading')}>Game phase</div>
                    <div ${className('about__ruleset-group')}>
                        ${Rule({ number: '3.2', innerText: 'You should open pairs by clicking the right ones.' })}
                        ${Rule({ number: '3.3', innerText: 'Your goal to open all cards as precise as you can.' })}
                    </div>
                </div>
                <div ${className('about__ruleset')}>
                    <div ${className('about__ruleset-heading')}>Score</div>
                    <div ${className('about__ruleset-group')}>
                        ${Rule({
                            number: '3.4',
                            innerText: 'After match you score will be presented in the leader board.',
                        })}
                        <div ${className('about__rule')}>
                            <span ${className('about__counter')}>3.5</span>
                            <div ${className('about__text', 'about-game__formula')}>
                                <div>Score calculated by formula:</div>
                                <div>(All opens - errors) x 100 - ms / 10</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

RulesGame.route = '#/rules/game'
RulesGame.locator = 'Game rules'
