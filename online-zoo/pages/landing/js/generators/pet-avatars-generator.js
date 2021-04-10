/* Config */

const pathPrepend = '../../assets/images/animals/';
const animals = {
    panda: {
        name: 'Pandas',
        url: pathPrepend + 'xtina-yu.jpg',
        linkTo: '../pages/zoos/panda/',
    },
    gorilla: {
        name: 'Gorillas',
        url: pathPrepend + 'simbi-yvan.jpg',
        linkTo: '../pages/zoos/gorilla/',
    },
    eagle: {
        name: 'Eagles',
        url: pathPrepend + 'nathan-lemon.jpg',
        linkTo: '../pages/zoos/eagle/',
    },
    alligator: {
        name: 'Alligators',
        url: pathPrepend + 'matthew-essman.jpg',
        linkTo: '../pages/zoos/alligator/',
    },
    elephant: {
        name: 'Elephants',
        url: pathPrepend + 'marc-bombenon.jpg',
        linkTo: null,
    },
    lemur: {
        name: 'Lemurs',
        url: pathPrepend + 'victoria-bragg.jpg',
        linkTo: null,
    },
};

const animalsConfigsArray = [...Object.values(animals), animals.panda];

/* Functions */

const getAvatarTemplate = ({ name, url, linkTo }) => {
    return (
        `<div class="pet-avatar">
            <a class="pet-avatar__link-wrapper" href="${linkTo}">
                <svg class="pet-avatar__outer-svg" width="105" height="96" viewBox="0 0 105 96">
                    <svg class="pet-avatar__inner-svg" mask="url(#avatarOuterClip)" fill="#F6F9FA">
                        <image class="pet-avatar__img" y="13" height="79" href="${url}"/>
                        <use class="pet-avatar__back" href="#avatarClippedRect"/>
                    </svg>
                </svg>
                <span class="pet-avatar__name">${name}</span>
            </a>
         </div>`
    );
};

const getNode = (htmlString) => {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};

const generateAvatars = (container, configsArray) => {
    configsArray
        .map(avatarConfig => getAvatarTemplate(avatarConfig))
        .map(avatarTemplate => getNode(avatarTemplate))
        .forEach(avatarNode => {
            container.appendChild(avatarNode)
        });
};

/* Init */

const container = document.querySelector('.beautifuls__animals-container');
generateAvatars(container, animalsConfigsArray);