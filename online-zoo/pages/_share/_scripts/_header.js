/** BURGER MENU */
{
    const body = document.querySelector('body');
    const burger = document.querySelector('#burger');
    const header = document.querySelector('.header');
    
    burger.addEventListener('click', (event) => {
        header.classList.toggle('_js-burger');
        body.classList.toggle('_js-no-scroll');
    });

    window.matchMedia('(min-width: 1200px)')
    .addEventListener('change', (event) => {
        header.classList.remove('_js-burger');
        body.classList.remove('_js-no-scroll');
    });
}

/** SEARCH BAR */
{
    const search = document.querySelector('#search');
    const searchBtn = document.querySelector('#search button');
    const searchInput = document.querySelector('#search input');
    searchBtn.addEventListener('click', (event) => {
        search.classList.toggle('search--active');
        searchInput.focus();
        setTimeout(() => searchInput.value = "", 300);
    });
}

import {createAuthPopUp} from './popups/_create-auth.js';

/** AUTH POPUP */
{
    const header = document.querySelector('.header');
    const signButton = document.getElementById('signButton');
    const logButton = document.getElementById('logButton');
    const authUserElement = document.getElementById('authUser');

    const authUserImageElement = authUserElement.querySelector('#userLogo');
    authUserImageElement.addEventListener('click', event => {
        authUserElement.classList.toggle('_js-dropdown');
    });

    /* LOG OUT */
    
    const logOutCallback = () => {
        header.classList.remove('_js-logged');
        authUserElement.classList.toggle('_js-dropdown');
        localStorage.setItem('authName', '');
    };

    const authLogOutBtn = authUserElement.querySelector('#userLogOut');
    authLogOutBtn.addEventListener('click', event => {
        logOutCallback();
    });

    /* AUTH */

    const authCallback = (name, modal) => {
        header.classList.add('_js-logged');
        const authNameSubElement = authUserElement.querySelector('span');
        authNameSubElement.innerText = name;
        if (modal) modal.remove();
        localStorage.setItem('authName', name);
    };

    signButton.addEventListener('click', () => {
        document.body.prepend( createAuthPopUp('_sign', authCallback) );
    });

    logButton.addEventListener('click', () => {
        document.body.prepend( createAuthPopUp('_log', authCallback) );
    });

    /* SESSION AUTO LOGIN */

    const authStoredName = localStorage.getItem('authName');
    if (authStoredName) authCallback(authStoredName);
}

/** HIDE ONLOAD */
{
    document.querySelectorAll('._header-load')
        .forEach(node => node.classList.remove('_header-load'));
}