const config = {
    objects: (pathTo = '') => ([
        {
            name: 'Pandas',
            description: 'Shenshuping Gengda Panda Center',
            url: pathTo + 'xtina-yu.jpg',
            linkTo: '../zoos/panda/',
        },
        {
            name: 'Eagles',
            description: 'Catalina Island',
            url: pathTo + 'nathan-lemon.jpg',
            linkTo: '../zoos/eagle/',
        },
        {
            name: 'Gorillas',
            description: 'GRACE gorillas',
            url: pathTo + 'simbi-yvan.jpg',
            linkTo: '../zoos/gorilla/',
        },
        {
            name: 'Aligators',
            description: 'St. Augustine\'s Alligator Farm Zoological Park',
            url: pathTo + 'matthew-essman.jpg',
            linkTo: '../zoos/alligator/',
        },
        {
            name: 'Elephants',
            description: 'Tembe Elephant Park',
            url: pathTo + 'marc-bombenon.jpg',
            linkTo: null,
        },
        {
            name: 'Lemurs',
            description: 'Madagascar',
            url: pathTo + 'victoria-bragg.jpg',
            linkTo: null,
        },
    ])  
    // 'bob-walke.jpg', 'luca-abad-lopez.jpg',
};

const getCardTemplate = (
    { name, description, url, linkTo },
    iconPath = null,
    clippedRectId = null,
    cardColor = null
) => {
    const iconVar = iconPath ? `--bg-icon: url('${iconPath}')` : ``;
    const cardColorVar = cardColor ? '--color: ${cardColor}' : ``;
    /* CSS vars: --url, [--bg-icon], [--color] */
    return (
        `<article class="pet-card" 
            style="--url: url('${url}'); ${iconVar} ${cardColorVar}">
            <a class="pet-card__link" href="${linkTo ? linkTo : ``}">
                <svg width="238" height="237" viewBox="0 0 238 237" class="pet-card__mask" fill="none">
                    ${clippedRectId ? `<use href="${clippedRectId}" fill="white"/>` : ``}
                </svg>
                <div class="pet-card__description">
                    <h4 class="pet-card__heading">${name}</h4>
                    <p class="pet-card__paragraph">${description}</p>
                </div>
            </a>
        </article>`
    );
};

const getNode = (htmlString) => {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};

const generateCards = (container, config) => {
    const getCardTemplateConfigured = (cardConfig) => {
        return getCardTemplate(
            cardConfig,
            '../../../assets/icons/tv.svg', // iconPath
            '#clippedRect', // clippedRectId
    )};
    config.objects('../../../assets/images/pet-cards/')
        .map(cardConfig => getCardTemplateConfigured(cardConfig))
        .map(cardTemplate => getNode(cardTemplate))
        .forEach(cardNode => {
            container.appendChild(cardNode)
        });
};

generateCards(
    document.querySelector('.pets__cards-container'), config);