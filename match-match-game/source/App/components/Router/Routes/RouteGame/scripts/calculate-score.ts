export type Parameters = {
    timeMs: number
    errors: number
    attempts: number
}

export const calculateScore = ({ timeMs, attempts, errors }: Parameters) => {
    return Math.max((attempts - errors) * 100 - (timeMs / 1000) * 10, 0)
}
