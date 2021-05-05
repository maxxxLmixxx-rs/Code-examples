{
    const mainContainer = document.querySelector('[main-container]');
    const secondaryContainers = document.querySelectorAll('[container]');
    const likeElement = document.querySelector('#like');

    function switchMain(index) {
        const main_iframe = mainContainer.querySelector('iframe');
        const main_iframe_clone = main_iframe.cloneNode();
        const secondary_iframe = secondaryContainers[index].querySelector('iframe');
        const secondary_iframe_clone = secondary_iframe.cloneNode();
        /** Insert */
        main_iframe.parentElement.insertBefore(secondary_iframe_clone, main_iframe);
        secondary_iframe.parentElement.insertBefore(main_iframe_clone, secondary_iframe);
        /** Delete */
        secondary_iframe_clone.addEventListener('load', () => {
            const isLike = secondary_iframe_clone.getAttribute('like');
            if (isLike === 'true') {
                likeElement.classList.add('_active');
            } else {
                likeElement.classList.remove('_active');
            }
            main_iframe.remove();
        });
        main_iframe_clone.addEventListener('load', () => {
            secondary_iframe.remove();
        });
    }

    likeElement.addEventListener('click', () => {
        const main_iframe = mainContainer.querySelector('iframe');
        const isLike = main_iframe.getAttribute('like');
        if (isLike === 'true') {
            main_iframe.setAttribute('like', 'false');
            likeElement.classList.remove('_active');
        } else {
            main_iframe.setAttribute('like', 'true');
            likeElement.classList.add('_active');
        }
    });

    secondaryContainers.forEach((container) => {
        container.addEventListener('click', ({ target }) => {
            const index = 
            Array.from(secondaryContainers)
                .findIndex((element) => element === target);
            switchMain(index);
        });
    });
}