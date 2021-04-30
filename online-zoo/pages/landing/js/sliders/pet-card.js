import {generateTemplates} from '../templates/gen-templates.js';
import {getCardTemplate} from '../templates/_pet-card.js';
import {animals} from '../animals.js';
import {moveLeft} from '../sliders/_move-left.js';
import {moveRight} from '../sliders/_move-right.js';

{
    const animalsArray = getCached() ? getCached() : setCache([
        animals.kangaroo,
        animals.koala,
        animals.panda,
        animals.gorilla,
        animals.eagle,
        animals.alligator,
        animals.elephant,
        animals.lemur,
    ]);

    const carousel = document.getElementById('pet-carousel');
    generateTemplates(carousel, getCardTemplate, animalsArray);

    const leftBtn = document.getElementById('pet-left');
    const rightBtn = document.getElementById('pet-right');

    leftBtn.addEventListener('click', () => {
        moveLeft(carousel, '.pet-card', 2)
        .then(() => {
            const child_1 = animalsArray.shift();
            const child_2 = animalsArray.shift();
            animalsArray.push(child_1, child_2);
            setCache(animalsArray);
        });
    });
    rightBtn.addEventListener('click', () => {
        moveRight(carousel, '.pet-card', 2)
        .then(() => {
            const child_1 = animalsArray.pop();
            const child_2 = animalsArray.pop();
            animalsArray.unshift(child_2, child_1);
            setCache(animalsArray);
        });
    });

    function setCache(toCache) {
        sessionStorage.setItem('pet-cards', JSON.stringify(toCache));
        return toCache;
    }
    function getCached() {
        return JSON.parse(sessionStorage.getItem('pet-cards'));
    }
}