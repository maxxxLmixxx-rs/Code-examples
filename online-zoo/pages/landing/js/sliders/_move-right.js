export function moveRight(carousel, childClass, moveNumber = 1) {
    return new Promise((resolve) => {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;
    
        const childNodes = carousel.querySelectorAll(`${childClass}:nth-last-of-type(-n + ${moveNumber})`);
    
        carousel.classList.add('_move-right');
        carousel.addEventListener('animationend', animationend);
    
        function animationend(event) {
            childNodes.forEach(node => node.remove());
            Array.from(childNodes)
                .reverse()
                .forEach(node => carousel.prepend(node.cloneNode(true)));
            carousel.classList.remove('_move-right');
            carousel.removeEventListener('animationend', animationend);
            resolve();
        }
    });
}