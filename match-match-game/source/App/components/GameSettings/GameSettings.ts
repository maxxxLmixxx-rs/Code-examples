import { Component } from '../../Component'
import { GameSize } from './GameSize/GameSize'
import { GamePack } from './GamePack/GamePack'
import { store } from '../../store/store'

export class GameSettings extends Component {
    private id
    private readonly
    private redirection

    constructor(id: number, params: { readonly?: boolean; redirection?: boolean } = {}) {
        super()
        this.id = id
        this.readonly = 'readonly' in params ? params.readonly : true
        this.redirection = 'redirection' in params ? params.redirection : false

        if (store.state.gameSettings.gamePhase > 0) {
            this.readonly = true
        }
    }

    getHtml(): string {
        return `
            ${new GameSize({ id: this.id, readonly: !!this.readonly, redirection: !!this.redirection }).getHtml()}
            ${new GamePack({ id: this.id, readonly: !!this.readonly, redirection: !!this.redirection }).getHtml()}
        `
    }
}
