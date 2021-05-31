const isAlphabet = (value: string): boolean => {
    return /^[0-9A-Z]*$/i.test(value)
}

const isLetter = (value: string): boolean => {
    return /^[A-Z]*$/i.test(value)
}

const isNotEmpty = (value: string): boolean => {
    return !!value.trim()
}

/** @example 'word1  ' -> TRUE; 'word1  word2' -> FALSE */
const isOneWord = (value: string): boolean => {
    return value.trim().split(' ').length < 2
}

const isValidEmail = (email: string): boolean => {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
}

/** EXPORT */

export const nameValidation = (name: string): boolean => {
    return isNotEmpty(name) && isLetter(name) && isOneWord(name)
}

export const emailValidation = (email: string): boolean => {
    return isValidEmail(email)
}
