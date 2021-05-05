export const getAvatarTemplate = ({ name, url, linkTo }) => {
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