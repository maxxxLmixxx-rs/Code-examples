import {generateTemplates} from '../templates/gen-templates.js';
import {getAvatarTemplate} from '../templates/_pet-avatar.js';
import {animals} from '../animals.js';

{
    const animalsArray = [
        animals.koala,
        animals.panda,
        animals.gorilla,
        animals.eagle,
        animals.alligator,
        animals.elephant,
        animals.lemur,
        animals.kangaroo, 
    ];
    
    /* Initialization */
    const carousel = document.getElementById('avatar-carousel');
    generateTemplates(carousel, getAvatarTemplate, animalsArray);
    
    /* Slider */
    const leftBtn = document.getElementById('avatar-left');
    const rightBtn = document.getElementById('avatar-right');
    
    leftBtn.addEventListener('click', moveLeft);
    rightBtn.addEventListener('click', moveRight);
    
    function moveLeft() {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;

        const child_first = carousel.querySelector('.pet-avatar:first-of-type');

        carousel.classList.add('_move-left');
        carousel.addEventListener('animationend', animationend);

        carousel.append(child_first.cloneNode(true));

        function animationend(event) {
            child_first.remove();
            carousel.classList.remove('_move-left');
            carousel.removeEventListener('animationend', animationend);
        }
    }
    
    function moveRight() {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;

        const child_last = carousel.querySelector('.pet-avatar:last-of-type');

        carousel.classList.add('_move-right');
        carousel.addEventListener('animationend', animationend);

        function animationend(event) {
            child_last.remove();
            carousel.prepend(child_last.cloneNode(true));
            carousel.classList.remove('_move-right');
            carousel.removeEventListener('animationend', animationend);
        }
    }
}