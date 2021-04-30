import {generateTemplates} from '../templates/gen-templates.js';
import {getCardTemplate} from '../templates/_pet-card.js';
import {animals} from '../animals.js';
import {moveLeft} from '../sliders/_move-left.js';
import {moveRight} from '../sliders/_move-right.js';

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

    const carousel = document.getElementById('pet-carousel');
    generateTemplates(carousel, getCardTemplate, animalsArray);

    const leftBtn = document.getElementById('pet-left');
    const rightBtn = document.getElementById('pet-right');

    leftBtn.addEventListener('click', () => moveLeft(carousel, '.pet-card', 2));
    rightBtn.addEventListener('click', () => moveRight(carousel, '.pet-card', 2));
}