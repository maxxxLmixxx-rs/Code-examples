import {moveLeft} from '../sliders/_move-left.js';

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
        if (!isBlocked) moveLeft(carousel, '.review').then(createTick);
    }

    createTick();
}