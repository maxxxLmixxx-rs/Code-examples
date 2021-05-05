import {generateTemplates} from '../templates/gen-templates.js';
import {getAvatarTemplate} from '../templates/_pet-avatar.js';
import {animals} from '../animals.js';
import {moveLeft} from '../sliders/_move-left.js';
import {moveRight} from '../sliders/_move-right.js';

{
    const animalsArray = getCached() ? getCached() : setCache([
        animals.koala,
        animals.panda,
        animals.gorilla,
        animals.eagle,
        animals.alligator,
        animals.elephant,
        animals.lemur,
        animals.kangaroo, 
    ]);

    const carousel = document.getElementById('avatar-carousel');
    generateTemplates(carousel, getAvatarTemplate, animalsArray);

    const leftBtn = document.getElementById('avatar-left');
    const rightBtn = document.getElementById('avatar-right');

    leftBtn.addEventListener('click', () => {
        moveLeft(carousel, '.pet-avatar')
        .then(() => {
            animalsArray.push(animalsArray.shift());
            setCache(animalsArray);
        });
    });
    rightBtn.addEventListener('click', () => {
        moveRight(carousel, '.pet-avatar')
        .then(() => {
            animalsArray.unshift(animalsArray.pop());
            setCache(animalsArray);
        });
    });

    function setCache(toCache) {
        sessionStorage.setItem('pet-avatars', JSON.stringify(toCache));
        return toCache;
    }
    function getCached() {
        return JSON.parse(sessionStorage.getItem('pet-avatars'));
    }
}