/** BURGER MENU */
{
    const body = document.querySelector('body');
    const burger = document.querySelector('#burger');
    const header = document.querySelector('.header');
    
    burger.addEventListener('click', (event) => {
        header.classList.toggle('_js-burger');
        body.classList.toggle('_js-no-scroll');
    });

    window.matchMedia('(min-width: 993px)')
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

/** POPUP */
{

}