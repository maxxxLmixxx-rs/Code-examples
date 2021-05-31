import { _HashRouter } from './_HashRouter'
import { HashRoute } from './HashRoute.d'

export class HashRouter {
    static _router = new _HashRouter()
    static route(hash: string) {
        return HashRouter._router.route(hash)
    }

    static add(route: HashRoute) {
        return HashRouter._router.add(route)
    }

    static put(route: HashRoute) {
        return HashRouter._router.put(route)
    }

    static remove(hashes: string[]) {
        return HashRouter._router.remove(hashes)
    }

    static find(hashes: string[]) {
        return HashRouter._router.find(hashes)
    }
}
