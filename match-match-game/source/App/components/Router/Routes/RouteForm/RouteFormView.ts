import formStyles from './styles/RouteForm.module.scss'
import { classNameCreator } from '../../../../_share/_utilities/class-name-creator'
import { User } from '../../../../../libraries/Database/User.d'
import { Component } from '../../../../Component'
import { capture } from '../../../../_share/_utilities/capture'

const className = classNameCreator(formStyles)
const rawClassName = classNameCreator(formStyles, true)

type Configuration = {
    registerPlayer: (user: User) => void
    validateEmail: (email: string) => boolean
    validateName: (name: string) => boolean
    readonly: boolean
}

type Validator = (arg: string) => boolean
type State = {
    user: User
    errorClassNames: {
        fname: string
        lname: string
        email: string
        image: string
    }
    isChecked: boolean
}

const defaultProps = {
    disabled: true,
}

export class RouteFormView extends Component {
    static route: string
    static locator: string

    static STATE_STORAGE = 'ROUTE_FORM_VIEW'
    static state: State
    private state: State

    private resetState = (object?: State & any) => {
        RouteFormView.state = Component.storageState(
            object || {
                user: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    score: '',
                    image: null,
                },
                errorClassNames: {
                    fname: null,
                    lname: null,
                    email: null,
                    image: null,
                },
                isChecked: false,
            },
            RouteFormView.STATE_STORAGE
        )
        this.state = RouteFormView.state
    }

    private props: Required<Configuration>
    constructor(props: Configuration) {
        super()
        super.onCreated(RouteFormView, () => {
            document.addEventListener('input', this.documentInputEvents.bind(this))
            const windowLink = window as { [key: string]: any }
            windowLink['@@Events'] = {
                ...windowLink['@@Events'],
                registration: {
                    onRegisterClick: this.onRegisterClick.bind(this),
                    onCancelClick: this.onCancelClick.bind(this),
                    onInputLoad: this.onInputLoad.bind(this),
                },
            }
        })
        this.props = {
            ...defaultProps,
            ...props,
        }
        const stored = sessionStorage.getItem(RouteFormView.STATE_STORAGE)
        if (stored) this.resetState(JSON.parse(stored))
        else this.resetState()
        this.state = RouteFormView.state
    }

    /** WINDOW EVENTS */
    private windowEvent(eventType: string, eventName: string): string {
        return `${eventType}="window['@@Events']['registration']['${eventName}'](this)"`
    }

    private onInputLoad(target: HTMLInputElement) {
        const reader = new FileReader()
        if (target.files) {
            reader.readAsDataURL(target.files[0])
        }
        reader.onload = () => {
            const result = reader.result as string
            this.state.user.image = result
            const image = document.getElementById('image-avatar') as HTMLImageElement
            image.classList.remove(rawClassName('_js-error'))
            image.src = result
            this.state.errorClassNames.image = '_js-success'
        }
        reader.onerror = () => {
            console.log(reader.error)
        }
    }

    private isErrorClassName(value: string) {
        return !value || value === '_js-error'
    }

    private get areErrorClasses() {
        const classNameArray = Object.values(this.state.errorClassNames)
        return classNameArray.some(this.isErrorClassName)
    }

    private onCancelClick(target: HTMLInputElement) {
        window.event?.preventDefault()
        const removeStatus = (element: HTMLElement) => {
            element.classList.remove(rawClassName('_js-success'))
            element.classList.remove(rawClassName('_js-error'))
        }
        const form = document.getElementById('registration-form') as HTMLFormElement
        const fileInput = form.querySelector('input[type=file]') as HTMLInputElement
        const inputNodeList = form.querySelectorAll('input') as NodeListOf<HTMLInputElement>
        const imageAvatar = document.getElementById('image-avatar') as HTMLImageElement
        [...inputNodeList].forEach(input => {
            if (input === target) return 
            removeStatus(input)
            input.value = ''
        })
        fileInput.value = ''
        removeStatus(imageAvatar)
        imageAvatar.removeAttribute('src')
        this.resetState()
    }

    private onRegisterClick() {
        window.event?.preventDefault()
        if (this.isErrorClassName(this.state.errorClassNames.image)) {
            const image = document.getElementById('image-avatar') as HTMLImageElement
            image.classList.add(rawClassName('_js-error'))
            this.state.errorClassNames.image = '_js-error'
        }
        if (this.areErrorClasses) return
        this.props.registerPlayer(this.state.user as User)
        this.resetState()
    }

    /** DOCUMENT EVENTS */
    private documentInputEvents(event: any) {
        const target = event.target as HTMLInputElement
        const nameInput = capture('#form-fname', target)
        const surnameInput = capture('#form-lname', target)
        const emailInput = capture('#form-email', target)
        if (nameInput) this.fnameKeydown(nameInput)
        if (surnameInput) this.lnameKeydown(surnameInput)
        if (emailInput) this.emailKeydown(emailInput)
    }

    private fnameKeydown(target: HTMLInputElement) {
        this.validate(target, this.props.validateName)
        this.state.user.firstName = target.value
    }

    private lnameKeydown(target: HTMLInputElement) {
        this.validate(target, this.props.validateName)
        this.state.user.lastName = target.value
    }

    private emailKeydown(target: HTMLInputElement) {
        this.validate(target, this.props.validateEmail)
        this.state.user.email = target.value
    }

    private validate(target: HTMLInputElement, validator: Validator) {
        const isValid = validator(target.value)
        const setErrorStateClass = (className: string) => {
            if (target.id === 'form-fname') {
                this.state.errorClassNames.fname = className
            }
            if (target.id === 'form-lname') {
                this.state.errorClassNames.lname = className
            }
            if (target.id === 'form-email') {
                this.state.errorClassNames.email = className
            }
        }
        if (!target.value.trim()) {
            target.classList.remove(rawClassName('_js-success'))
            target.classList.remove(rawClassName('_js-error'))
            this.state.isChecked = false
            setErrorStateClass('')
        } else if (isValid) {
            target.classList.remove(rawClassName('_js-error'))
            target.classList.add(rawClassName('_js-success'))
            this.state.isChecked = true
            setErrorStateClass('_js-success')
        } else {
            target.classList.remove(rawClassName('_js-success'))
            target.classList.add(rawClassName('_js-error'))
            this.state.isChecked = false
            setErrorStateClass('_js-error')
        }
    }

    getHtml(): string {
        return `
            <form id="registration-form" ${className('registration-form')}
                  ${this.props.readonly ? `onsubmit="return false"` : ``}
            >
                <div ${className('registration-form__header')}>
                    <span>Register new Player</span>
                </div>
                <div ${className('registration-form__body')}>
                    <div ${className('registration-form__fieldset')}>
                        <p ${className('registration-form__input-group')}>
                            <label ${className('registration-form__label')}>
                                First name
                                ${
                                    this.props.readonly
                                        ? `
                                    <input type="text" ${className('registration-form__input')}/>
                                `
                                        : `
                                    <input type="text" id="form-fname"
                                        value="${this.state.user.firstName}"    
                                        class="
                                            ${rawClassName('registration-form__input')}
                                            ${rawClassName(this.state.errorClassNames.fname)}
                                        "
                                    />`
                                }
                            </label>
                        </p>
                        <p ${className('registration-form__input-group')}>
                            <label ${className('registration-form__label')}>
                                Last name
                                ${
                                    this.props.readonly
                                        ? `
                                    <input type="text" ${className('registration-form__input')}/>
                                `
                                        : `
                                    <input type="text" id="form-lname"
                                        value="${this.state.user.lastName}"    
                                        class="
                                            ${rawClassName('registration-form__input')}
                                            ${rawClassName(this.state.errorClassNames.lname)}
                                        "
                                    />`
                                }
                            </label>
                        </p>
                        <p ${className('registration-form__input-group')}>
                            <label ${className('registration-form__label')}>
                                Email
                                ${
                                    this.props.readonly
                                        ? `
                                    <input type="text" ${className('registration-form__input')}/>
                                `
                                        : `
                                    <input type="email" id="form-email"
                                        value="${this.state.user.email}"    
                                        class="
                                            ${rawClassName('registration-form__input')}
                                            ${rawClassName(this.state.errorClassNames.email)}
                                        "
                                    />`
                                }
                            </label>
                        </p>
                    </div>
                    <div ${className('registration-form__avatar')}>
                        <div>
                        ${
                            this.props.readonly
                                ? ``
                                : `
                            <input type="file"
                                ${this.windowEvent('onchange', 'onInputLoad')}
                                value="${this.state.user.image}"
                            />
                            <img 
                                id="image-avatar"
                                ${className(this.state.errorClassNames.image)}
                                ${this.state.user.image ? `src="${this.state.user.image}"` : ``}
                            />`
                        }
                        </div>
                    </div>
                    <div ${className('registration-form__controls')}>
                        <button
                            ${className('_btn', '_btn--mp', '_btn--dark', '_btn--round')}
                            ${this.props.readonly ? `` : this.windowEvent('onclick', 'onRegisterClick')}
                        >Register</button>
                        <input type="reset"
                            ${className('_btn', '_btn--mp', '_btn--dark', '_btn--round')}
                            ${this.props.readonly ? `` : this.windowEvent('onclick', 'onCancelClick')}
                            value="Cancel"
                        />
                    </div>
                </div>
            </form>
        `
    }
}
