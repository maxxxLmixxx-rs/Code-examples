const config = {
    objects: (pathTo = '') => ([
        {
            name: 'Pandas',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../pages/zoos/panda/',
        },
        {
            name: 'Eagles',
            url: pathTo + 'nathan-lemon.jpg',
            linkTo: '../pages/zoos/eagle/',
        },
        {
            name: 'Gorillas',
            url: pathTo + 'simbi-yvan.jpg',
            linkTo: '../pages/zoos/gorilla/',
        },
        {
            name: 'Aligators',
            url: pathTo + 'matthew-essman.jpg',
            linkTo: '../pages/zoos/alligator/',
        },
        {
            name: 'Elephants',
            url: pathTo + 'marc-bombenon.jpg',
            linkTo: null,
        },
        {
            name: 'Lemurs',
            url: pathTo + 'victoria-bragg.jpg',
            linkTo: null,
        },
        /** REPEAT --> change object to array */
        {
            name: 'Pandas',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../pages/zoos/panda/',
        },
        {
            name: 'Pandas',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../pages/zoos/panda/',
        },
        {
            name: 'Pandas',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../pages/zoos/panda/',
        },
        {
            name: 'Pandas',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../pages/zoos/panda/',
        },
    ])
}

const getAvatarTemplate = ({ name, url, linkTo }, clippedRectId = null) => {
    return (
        `<div class="pet-avatar">
            <a class="pet-avatar__link-wrapper" href="${linkTo}">
                <div class="pet-avatar__icon">
                    <img class="pet-avatar__img" height="75" src="${url}" alt="${name} photo">
                    <svg class="pet-avatar__mask" width="75" height="75" viewBox="0 0 238 237" fill="none">
                        <use href="${clippedRectId}" fill="white"/>
                    </svg>
                </div>
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

const generateAvatars = (container, config) => {
    const getAvatarTemplateConfigured = (avatarConfig) => {
        return getAvatarTemplate(avatarConfig, '#clippedRect')
    };
    config.objects('../../assets/images/animals/')
        .map(avatarConfig => getAvatarTemplateConfigured(avatarConfig))
        .map(avatarTemplate => getNode(avatarTemplate))
        .forEach(avatarNode => {
            container.appendChild(avatarNode)
        });
};

generateAvatars(
    document.querySelector('.beautifuls__animals-container'), config);