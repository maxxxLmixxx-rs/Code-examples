const isNotSpecial = (value: string): boolean => {
    return /^[^~!@#$%*()_—\-+=|:;"'`<>,.?/\\^]*$/i.test(value)
}

const isNotEmpty = (value: string): boolean => {
    return !!value.trim()
}

const isNotNumber = (value: string): boolean => {
    return /^[^0-9]*$/.test(value)
}

/** @example 'word1  ' -> TRUE; 'word1  word2' -> FALSE */
const isOneWord = (value: string): boolean => {
    return value.trim().split(' ').length < 2
}

const isNotTrimmed = (value: string): boolean => {
    return !/ $/.test(value)
}

const isValidEmail = (email: string): boolean => {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
}

const lessThen = (name: string, maxLength: number): boolean => {
    return name.length <= maxLength
}

/** EXPORT */

export const nameValidation = (name: string): boolean => {
    return (
        isNotEmpty(name) &&
        isNotTrimmed(name) &&
        isNotSpecial(name) &&
        isNotNumber(name) &&
        isOneWord(name) &&
        lessThen(name, 15)
    )
}

export const emailValidation = (email: string): boolean => {
    return isNotEmpty(email) && isNotTrimmed(email) && isValidEmail(email) && lessThen(email, 25)
}

/** ERRORS */

const errors = {
    notSpecial: 'Input should not contain special characters',
    notOneWord: 'Input should be only one word',
    notTrimmed: 'Input should not end with space symbol',
    notNumber: 'Input should not contain numbers',
    notEmpty: 'Input should not be empty',
    RFC5322: 'Example: 1@1.1',
    lessThen: (maxLength: number) => {
        return `Input should be less then ${maxLength} characters`
    },
}

export const nameErrorMessage = (name: string): string => {
    switch (false) {
        case isNotEmpty(name):
            return errors.notEmpty
        case isNotTrimmed(name):
            return errors.notTrimmed
        case isNotSpecial(name):
            return errors.notSpecial
        case isNotNumber(name):
            return errors.notNumber
        case isOneWord(name):
            return errors.notOneWord
        case lessThen(name, 15):
            return errors.lessThen(15)
        default:
            return ''
    }
}

export const emailErrorMessage = (email: string): string => {
    switch (false) {
        case isNotEmpty(email):
            return errors.notEmpty
        case isNotTrimmed(email):
            return errors.notTrimmed
        case isValidEmail(email):
            return errors.RFC5322
        case lessThen(email, 25):
            return errors.lessThen(25)
        default:
            return ''
    }
}
