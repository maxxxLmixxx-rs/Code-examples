export const knuthShuffle = <T extends number | string>(array: T[]): T[] => {
    const copy = [...array]
    for (let i = copy.length - 1; i >= 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        copy.push(copy.splice(randomIndex, 1)[0])
    }
    return copy
}

export const schwartzianShuffle = <T extends number | string>(array: T[]): T[] => {
    return array
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)
}
