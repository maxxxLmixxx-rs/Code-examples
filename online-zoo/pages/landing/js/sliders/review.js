{
    const carousel = document.getElementById('reviews-carousel');
    let isBlocked = false;

    carousel.addEventListener('click', event => {
        isBlocked = true;
        setTimeout(() => {
            isBlocked = false;
            createTick();
        }, 30_000);
    });

    function createTick() {
        setTimeout(timeoutFunction, 4000);
    }

    function timeoutFunction() {
        if (isBlocked) return;

        const child_first = document.querySelector('.review:first-of-type');

        carousel.classList.add('_move-left');
        carousel.addEventListener('animationend', animationend);

        function animationend(event) {
            child_first.remove();
            carousel.append(child_first.cloneNode(true));
            carousel.classList.remove('_move-left');
            carousel.removeEventListener('animationend', animationend);
            createTick();
        }
    }

    createTick();
}