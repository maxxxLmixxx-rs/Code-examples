import {getNode} from '../_getNode.js';
import {InputChecker} from './_InputChecker.js';
import {getAuthTemplate} from './templates/_auth.js';

const messages = {
    googleAuth: 'Logged in with Google',
    facebookAuth: 'Logged in with Facebook',
};

export const createAuthPopUp = (state, authCallback) => {
    const authElement = getNode( getAuthTemplate(state) ); 
    const authCallbackModified = (name) => authCallback(name, authElement);
    setGeneralListeners(authElement);
    setSignUpListeners(authElement, authCallbackModified);
    setLogInListeners(authElement, authCallbackModified);
    return authElement;
};

function setGeneralListeners(authElement) {
    const switchToSignBtn = authElement.querySelector('#toSign');
    const switchToLogBtn = authElement.querySelector('#toLog');
    const popupBack = authElement.querySelector('#popupBack');

    switchToSignBtn.addEventListener('click', event => {
        authElement.classList.add('_sign');
        authElement.classList.remove('_log');
    });

    switchToLogBtn.addEventListener('click', event => {
        authElement.classList.remove('_sign');
        authElement.classList.add('_log');
    });

    popupBack.addEventListener('click', event => {
        authElement.remove();
    });
}

function setSignUpListeners(authElement, authCallback) {
    logOnclick(authCallback, {
        element: authElement.querySelector('#signGoogle'),
        userName: messages.googleAuth,
    });
    logOnclick(authCallback, {
        element: authElement.querySelector('#signFacebook'),
        userName: messages.facebookAuth,
    });
    
    function SignInputChecker(props) {
        InputChecker.call(this, props);
    }

    const signNameInput = authElement.querySelector('#signName');
    const signEmailInput = authElement.querySelector('#signEmail');
    const signPasswordInput = authElement.querySelector('#signPassword');
    const agreementCheckbox = authElement.querySelector('#signAgreement');

    const checkers = [
        new SignInputChecker({
            target: signNameInput,
            checker: InputChecker.getIsBlankChecker()
        }),
        new SignInputChecker({
            target: signEmailInput,
            checker: InputChecker.getIsBlankChecker()
        }),
        new SignInputChecker({
            target: signPasswordInput,
            checker: InputChecker.getIsLengthChecker(8)
        }),
        new SignInputChecker({
            target: agreementCheckbox,
            checker: InputChecker.getIsCheckedChecker()
        }),
    ];

    const signForm = authElement.querySelector('#signForm');
    const allowOn = () => checkers.every(c => c.status === true);
    SignInputChecker.prototype.ifAllowed = disableSubmitCreator(signForm, allowOn);

    signForm.addEventListener('submit', event => {
        event.preventDefault();
    });

    signForm
        .querySelector('input[type=submit]')
        .addEventListener('click', submitEvent);

    function submitEvent(event) {
        authCallback(signNameInput.value);
    }
}

function setLogInListeners(authElement, authCallback) {
    logOnclick(authCallback, {
        element: authElement.querySelector('#logGoogle'),
        userName: messages.googleAuth,
    });
    logOnclick(authCallback, {
        element: authElement.querySelector('#logFacebook'),
        userName: messages.facebookAuth,
    });

    function LogInputChecker(props) {
        InputChecker.call(this, props);
    }

    const logEmailInput = authElement.querySelector('#logEmail');
    const logPasswordInput = authElement.querySelector('#logPassword');

    const checkers = [
        new LogInputChecker({
            target: logEmailInput,
            checker: InputChecker.getIsBlankChecker()
        }),
        new LogInputChecker({
            target: logPasswordInput,
            checker: InputChecker.getIsBlankChecker()
        }),
    ];

    const logForm = authElement.querySelector('#logForm');
    const allowOn = () => checkers.every(c => c.status === true);
    LogInputChecker.prototype.ifAllowed = disableSubmitCreator(logForm, allowOn);    

    const users = {
        map: {
            'user@gmail.com': 'useruser',
        },
        findUser(email, password) {
            if (!this.map[email] || this.map[email] !== password) {
                return this.getStatus(false, 'Incorrect email or password');
            }
            return this.getStatus(true, email);
        },
        getStatus(bool, message) {
            return {
                status: bool, message: message ? message : null
            }
        }
    };

    logForm.addEventListener('submit', event => {
        event.preventDefault();
    });

    logForm
        .querySelector('input[type=submit]')
        .addEventListener('click', submitEvent);

    function submitEvent(event) {
        const email = authElement.querySelector('#logEmail').value.trim();
        const password = authElement.querySelector('#logPassword').value.trim();

        const result = users.findUser(email, password);
        if (result.status === false) return alert(result.message);

        authCallback(result.message);
    }
}

function logOnclick(authCallback, { element, userName }) {
    element.addEventListener('click', event => {
        authCallback(userName);
    });
}

function disableSubmitCreator(element, allowOn, className = '_js-disabled') {
    element.classList.add(className);
    return () => {
        element.classList.add(className);
        if (allowOn()) {
            element.classList.remove(className);
        }
    }
}