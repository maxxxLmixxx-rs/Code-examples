export const capture = <T extends string, K extends HTMLElement>(
    captureQuery: T,
    targetElement: K
): K | null | never => {
    const captureCollection = document.querySelectorAll(captureQuery)
    if (!targetElement) throw new Error(`Cannot find 'targetElement' in DOM`)
    if (!captureCollection) throw new Error(`Cannot find 'captureQuery' in DOM`)
    const captured = [...captureCollection].find((element) => element.contains(targetElement))
    return (captured as K) || null
}
