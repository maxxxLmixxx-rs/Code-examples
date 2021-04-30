export function moveLeft(carousel, childClass, moveNumber = 1) {
    return new Promise((resolve) => {
        if (carousel.classList.contains('_move-left')) return;
        if (carousel.classList.contains('_move-right')) return;
    
        const childNodes = carousel.querySelectorAll(`${childClass}:nth-of-type(-n + ${moveNumber})`);
    
        carousel.classList.add('_move-left');
        carousel.addEventListener('animationend', animationend);
    
        childNodes.forEach(node => carousel.append(node.cloneNode(true)));
        
        function animationend(event) {
            childNodes.forEach(node => node.remove());
            carousel.classList.remove('_move-left');
            carousel.removeEventListener('animationend', animationend);
            resolve(childNodes);
        }
    });
}