import mainStyles from './styles/Router.module.scss'
import { classNameCreator } from '../../_share/_utilities/class-name-creator'
import { Component } from '../../Component'

const className = classNameCreator(mainStyles)

type Configuration = {
    routeName: string
    routeHtml: string
    modal?: {
        condition: boolean
        element: Component
    }
}

const defaultProps: Configuration = {
    routeName: 'Placeholder',
    routeHtml: '',
}

export class RouterView extends Component {
    constructor(public props: Configuration = defaultProps) {
        super()
        this.props = {
            ...defaultProps,
            ...props,
        }
    }

    getHtml(): string {
        return `
            <main ${className('main')}>
                <div ${className('main__body')}>
                    ${this.props?.modal?.condition ? this.props.modal.element.getHtml() : ''}
                    ${this.props.routeHtml}
                </div>
                <div ${className('main__locator')}>${this.props.routeName}</div>
            </main>
        `
    }
}
