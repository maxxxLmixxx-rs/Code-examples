export const authPopup = (state) => {
    if (state !== '_sign' || state !== '_log') {
        throw new Error(`State must be '_sign' or '_log' string`);
    }

    return `<div class="auth-popup popup ${state}">
        <div class="popup__back"></div>
        <div class="popup__body">
            <div class="popup__header">
                <div class="logo">
                    <a class="logo__link nav__link" href="../landing/">
                        <img class="logo__img" width="108" height="84" src="../../assets/icons/logo.svg" alt="online zoo">
                    </a>
                </div>
            </div>
            <div class="popup__main">
                <div class="auth-popup__switcher">
                    <button class="auth-popup__switch-btn">Create Account</button>
                    <button class="auth-popup__switch-btn">Log in</button>
                </div>
                <div class="auth-popup__container">
                    <form id="sign-form" class="popup__form">
                        <div class="auth-popup__socials popup__input-row">
                            <button class="auth-popup__social-btn">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M0 0h24v24H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.04 12.26c0-.81-.07-1.6-.2-2.35H12v4.45h6.19a5.29 5.29 0 01-2.3 3.47v2.88h3.72c2.18-2 3.43-4.95 3.43-8.45z" fill="#4285F4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 23.5c3.1 0 5.7-1.03 7.61-2.79l-3.72-2.88a6.91 6.91 0 01-3.89 1.1c-3 0-5.53-2.03-6.43-4.75H1.72v2.98A11.5 11.5 0 0012 23.5z" fill="#34A853"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.57 14.19a6.91 6.91 0 010-4.38V6.84H1.72a11.5 11.5 0 000 10.32l3.85-2.97z" fill="#FBBC05"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.07c1.69 0 3.2.58 4.4 1.72l3.3-3.3A11.5 11.5 0 001.72 6.84l3.84 2.98A6.85 6.85 0 0112 5.07z" fill="#EA4335"/></svg>
                                Google Sign in
                            </button>
                            <button class="auth-popup__social-btn">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M23.5 12.07a11.5 11.5 0 10-13.3 11.36v-8.04H7.28v-3.32h2.92V9.54c0-2.89 1.72-4.48 4.35-4.48 1.25 0 2.57.23 2.57.23v2.83h-1.45c-1.43 0-1.87.88-1.87 1.8v2.15h3.19l-.51 3.32H13.8v8.04a11.5 11.5 0 009.7-11.36z" fill="#1877F2"/></svg>
                                Facebook Sign in
                            </button>
                        </div>
                        <div class="popup__input-row">
                            <label class="popup__form-label" for="">Name</label>
                            <input class="popup__form-input" type="text">
                        </div>
                        <div class="popup__input-row">
                            <label class="popup__form-label" for="">Email</label>
                            <input class="popup__form-input" type="email">
                        </div>
                        <div class="popup__input-row">
                            <label class="popup__form-label" for="">Password</label>
                            <input class="popup__form-input" type="password">
                        </div>
                        <div class="popup__input-row popup__input-row--horizontal">
                            <input class="popup__form-checkbox" type="checkbox">
                            <label class="popup__form-label popup__form-label--small" for="">Agree with the User Agreement and Privacy Policy</label>
                        </div>
                        <input type="submit" class="popup__send-btn _btn _btn--m-pd _btn--s-ls _btn--dark-green" value="Send" />
                    </form>
                    <form id="log-form" class="popup__form">
                        <div class="auth-popup__socials popup__input-row">
                            <button class="auth-popup__social-btn">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M0 0h24v24H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.04 12.26c0-.81-.07-1.6-.2-2.35H12v4.45h6.19a5.29 5.29 0 01-2.3 3.47v2.88h3.72c2.18-2 3.43-4.95 3.43-8.45z" fill="#4285F4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 23.5c3.1 0 5.7-1.03 7.61-2.79l-3.72-2.88a6.91 6.91 0 01-3.89 1.1c-3 0-5.53-2.03-6.43-4.75H1.72v2.98A11.5 11.5 0 0012 23.5z" fill="#34A853"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.57 14.19a6.91 6.91 0 010-4.38V6.84H1.72a11.5 11.5 0 000 10.32l3.85-2.97z" fill="#FBBC05"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.07c1.69 0 3.2.58 4.4 1.72l3.3-3.3A11.5 11.5 0 001.72 6.84l3.84 2.98A6.85 6.85 0 0112 5.07z" fill="#EA4335"/></svg>
                                Google Log in
                            </button>
                            <button class="auth-popup__social-btn">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M23.5 12.07a11.5 11.5 0 10-13.3 11.36v-8.04H7.28v-3.32h2.92V9.54c0-2.89 1.72-4.48 4.35-4.48 1.25 0 2.57.23 2.57.23v2.83h-1.45c-1.43 0-1.87.88-1.87 1.8v2.15h3.19l-.51 3.32H13.8v8.04a11.5 11.5 0 009.7-11.36z" fill="#1877F2"/></svg>
                                Facebook Log in
                            </button>
                        </div>
                        <div class="popup__input-row">
                            <label class="popup__form-label" for="">Name</label>
                            <input class="popup__form-input" type="text"> 
                        </div>
                        <div class="popup__input-row">
                            <label class="popup__form-label" for="">Email</label>
                            <input class="popup__form-input" type="email">
                        </div>
                        <input type="submit" class="popup__send-btn _btn _btn--m-pd _btn--s-ls _btn--dark-green" value="Send" />
                    </form>
                </div>
            </div>
        </div>
    </div>`
};