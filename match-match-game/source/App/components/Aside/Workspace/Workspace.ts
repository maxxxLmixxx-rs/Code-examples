import asideStyles from '../styles/Aside.module.scss'
import { classNameCreator } from '../../../_share/_utilities/class-name-creator'
import { WorkspaceType } from './Workspace.d'
import { store } from '../../../store/store'

const className = classNameCreator(asideStyles)
const rawClassName = classNameCreator(asideStyles, true)

export const Workspace = (props: WorkspaceType) => `
    <div class="
        ${rawClassName('explorer__item')} 
        ${props.active ? rawClassName('_js-active') : ''}"
    >
        <div ${className('explorer__label')}>
            <span>${props.menuName || 'Has no name'}</span>
            ${
                props.gotoLink
                    ? `<a 
                        ${className('_btn', '_btn--sp', '_btn--dark', '_btn--round')}
                        ${store.state.gameSettings.gamePhase === 0 ? `href="${props.gotoLink}"` : ''}
                       >goto</a>`
                    : ``
            }
        </div>
        <div ${className('explorer__space')}>${props.innerHtml || 'Has no content'}</div>
    </div>
`
