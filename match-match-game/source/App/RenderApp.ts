import { App } from './App'
import { store } from './store/store'

export const renderApp = function () {
    ;(document.getElementById('root') as HTMLElement).innerHTML = new App().getHtml()
}

store.subscribe(renderApp)
