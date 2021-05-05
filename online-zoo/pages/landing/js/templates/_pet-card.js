export const getCardTemplate = ({ name, description, url, linkTo }) => {
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