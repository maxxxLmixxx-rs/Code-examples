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