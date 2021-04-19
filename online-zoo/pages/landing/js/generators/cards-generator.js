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
            name: 'Alligators',
            description: 'St. Augustine\'s Zoological&nbsp;Park',
            // description: 'St. Augustine\'s Alligator Farm Zoological&nbsp;Park',
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
        {
            name: 'Lemurs',
            description: 'Madagascar',
            url: pathTo + 'victoria-bragg.jpg',
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

const getCardTemplate = ({ name, description, url, linkTo }) => {
    return (
        `<article class="pet-card">
            <a class="pet-card__link" href="${linkTo ? linkTo : ``}">
                <svg width="238" height="237" viewBox="0 0 238 237" class="pet-card__mask" fill="none">
                    <image class="pet-card__img" clip-path="url(#petCardImageClip)" x="-25%" height="220px" href="${url}"/>
                    <use class="pet-card__filter" href="#petCardFilterRect" />
                    <use class="pet-card__back" href="#petCardClippedRect" fill="white"/>
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
    config.objects('../../assets/images/animals/')
        .map(cardConfig => getCardTemplate(cardConfig))
        .map(cardTemplate => getNode(cardTemplate))
        .forEach(cardNode => {
            container.appendChild(cardNode)
        });
};

generateCards(
    document.querySelector('.pets__cards-container'), config);