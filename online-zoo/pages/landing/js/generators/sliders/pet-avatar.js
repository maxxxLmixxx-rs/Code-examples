import {generateTemplates} from '../templates/gen-templates.js';
import {getAvatarTemplate} from '../templates/_pet-avatar.js';
import {animals} from '../animals.js';

const animalsArray = [...Object.values(animals)];
const container = document.querySelector('.beautifuls__animals-container');
generateTemplates(container, getAvatarTemplate, animalsArray);