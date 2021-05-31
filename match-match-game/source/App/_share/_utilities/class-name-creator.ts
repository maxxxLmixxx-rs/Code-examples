type Styles = { [key: string]: string }

const splitBySpaces = (classesArray: string[]): string[] => {
    return classesArray.reduce((out: string[], c) => [...out, ...c.split(' ')], [])
}

const getClassName = (classesArray: string[], styles: Styles): string => {
    return splitBySpaces(classesArray)
        .map((c) => styles[c])
        .join(' ')
        .trim()
}

export const classNameCreator = (styles: Styles, raw = false) => {
    return (...classes: string[]): string => {
        if (classes.some((c) => !c)) return ''
        const className = getClassName(classes, styles)
        return raw ? `${className}` : `class="${className}"`
    }
}
