import modalStyles from './Modal.module.scss'
import { Component } from '../../Component'
import { classNameCreator } from '../../_share/_utilities/class-name-creator'

const className = classNameCreator(modalStyles)
const rawClassName = classNameCreator(modalStyles, true)

type Params = {
    message: string
    onsuccess: Function
}

export class Modal extends Component {
    constructor(private props: Params) {
        super()
        super.onCreated(Modal, () => {
            document.addEventListener('click', this.okButtonClick.bind(this))
        })
    }

    private okButtonClick(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement
        if (eventTarget.id === 'modal-btn') {
            const parentElement = eventTarget.parentElement as HTMLElement
            parentElement.classList.add(rawClassName('_js-hide'))
            parentElement.addEventListener(
                'animationend',
                () => {
                    this.props.onsuccess()
                },
                { once: true }
            )
        }
    }

    getHtml() {
        return `
            <div ${className('modal')}>
                <div ${className('modal__message')}>${this.props.message}</div>
                <button id="modal-btn" ${className('modal__button')}>OK</button>
            </div>
        `
    }
}
