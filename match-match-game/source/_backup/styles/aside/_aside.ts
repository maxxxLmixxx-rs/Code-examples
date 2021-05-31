const isButtonElement = (target: HTMLElement): boolean => target.classList.contains('_btn')

document.querySelectorAll('.explorer__label').forEach((element) => {
    element.addEventListener('click', ({ currentTarget, target }) => {
        if (isButtonElement(<HTMLElement>target)) return
        const parent = (<HTMLElement>currentTarget).parentNode
        ;(<HTMLElement>parent).classList.toggle('_js-active')
    })
})
