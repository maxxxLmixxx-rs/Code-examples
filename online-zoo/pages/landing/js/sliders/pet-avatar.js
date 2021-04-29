import {generateTemplates} from '../templates/gen-templates.js';
import {getAvatarTemplate} from '../templates/_pet-avatar.js';
import {animals} from '../animals.js';

const animalsArray = [...Object.values(animals)];


{
    const animalsArray = [
        animals.kangaroo,
        animals.koala,
        animals.panda,
        animals.gorilla,
        animals.eagle,
        animals.alligator,
        animals.elephant,
        animals.lemur,     
    ];
    
    /* Initialization */
    const container = document.querySelector('.beautifuls__animals-container');
    generateTemplates(container, getAvatarTemplate, animalsArray);
    
    /* Slider */
    const leftBtn = document.getElementById('avatar-left');
    const rightBtn = document.getElementById('avatar-right');
    const carousel = document.getElementById('avatar-carousel');
    
    leftBtn.addEventListener('click', moveLeft);
    rightBtn.addEventListener('click', moveRight);
    
    function moveLeft() {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;

        const child_1 = carousel.querySelector('.pet-card:nth-of-type(1)');
        const child_2 = carousel.querySelector('.pet-card:nth-of-type(2)');

        carousel.classList.add('_move-left');
        carousel.addEventListener('animationend', animationend);

        carousel.append(child_1.cloneNode(true));
        carousel.append(child_2.cloneNode(true));

        function animationend(event) {
            child_1.remove();
            child_2.remove();
            carousel.classList.remove('_move-left');
            carousel.removeEventListener('animationend', animationend);
        }
    }
    
    function moveRight() {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;

        const child_1 = carousel.querySelector('.pet-card:nth-last-of-type(1)');
        const child_2 = carousel.querySelector('.pet-card:nth-last-of-type(2)');

        carousel.classList.add('_move-right');
        carousel.addEventListener('animationend', animationend);

        function animationend(event) {
            child_1.remove();
            child_2.remove();
            carousel.prepend(child_1.cloneNode(true));
            carousel.prepend(child_2.cloneNode(true));
            carousel.classList.remove('_move-right');
            carousel.removeEventListener('animationend', animationend);
        }
    }
}