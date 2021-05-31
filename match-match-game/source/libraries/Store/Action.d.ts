export type Action = {
    payload?: Object
    type: string
}
export type ThunkActionCreator = (dispatch: Function, state?: any) => void
export type ActionCreator = Action | ThunkActionCreator
