import { HashRoute } from './HashRoute'

type OneRoute = Pick<HashRoute, 'callback' | 'exact'> & {
    hash: string
}

interface RouterType<TClass> {
    find(hashes: string[]): Array<OneRoute | null>
    remove(hashes: string[]): TClass
    route(hash: string): TClass
    put(route: HashRoute): TClass
    add(route: HashRoute): TClass
}

export class _HashRouter implements RouterType<_HashRouter> {
    static routeList: OneRoute[] = []
    static testException: string[] = ['*']

    private blockHashchangeEvent = false

    static messages: { [prop: string]: (...args: string[]) => string } = {
        /* 0 */ hashExists: (routeHash: string) => `Route '${routeHash}' exists. Routes should be unique.`,
        /* 1 */ noSuchRoute: (routeHash: string) => `There is no defined ${routeHash}`,
        /* 2 */ shouldStartWithHash: (routeHash: string) => `Hash '${routeHash}' should start with '#'.`,
        /* 3 */ shouldNotContainDoubleSlash: (routeHash: string) => `Hash '${routeHash}' should not contain '//'.`,
        /* 4 */ shouldMatchRegex: (routeHash: string, regex: string) =>
            `Hash ${routeHash} should match regex '${regex}'`,
    }

    constructor() {
        this.blockHashchangeEvent = true
        const hashchangeEvent = this.windowHashchangeEvent.bind(this)
        window.addEventListener('hashchange', hashchangeEvent)
        this.blockHashchangeEvent = false
    }

    /** HASH HANDLERS */

    private windowHashchangeEvent(): void {
        if (this.blockHashchangeEvent) return
        this.hashchangeHandler()
    }

    private hashchangeHandler(): void {
        const locationHash = this.hashNormalizer(window.location.hash)
        const currentRoute = this.findRoute(locationHash)
        if (currentRoute) currentRoute.callback()
        else {
            const defaultRoute = this.findRoute('*')
            defaultRoute?.callback()
        }
    }

    /** UTILITIES */

    private hashNormalizer(hash: string): string {
        let output = hash
        if (output.startsWith('/')) output = output.slice(1)
        if (output.endsWith('/')) output = output.slice(0, -1)
        return output || '#'
    }

    /** VALIDATION */

    private validateHash(hash: string): void | never {
        type Checker = {
            regexp: RegExp
            expect: boolean
            errorMessageCreator: () => string
        }

        const checkers: Checker[] = [
            {
                regexp: /^[-_#/a-z0-9]*$/i,
                expect: false,
                errorMessageCreator() {
                    const regexp = `${this.regexp}`
                    return _HashRouter.messages.shouldMatchRegex(hash, regexp)
                },
            },
            {
                regexp: /[/]{2}/,
                expect: true,
                errorMessageCreator() {
                    return _HashRouter.messages.shouldNotContainDoubleSlash(hash)
                },
            },
            {
                regexp: /^#/,
                expect: false,
                errorMessageCreator() {
                    return _HashRouter.messages.shouldStartWithHash(hash)
                },
            },
        ]

        checkers.forEach((checker) => {
            const { regexp, expect, errorMessageCreator } = checker
            if (_HashRouter.testException.includes(hash)) return
            if (regexp.test(hash) === expect) {
                throw new Error(errorMessageCreator.call(checker))
            }
        })
    }

    private isHashUnique(hash: string): void | never {
        _HashRouter.routeList.forEach((route) => {
            if (hash === route.hash) {
                throw new Error(_HashRouter.messages.hashExists(hash))
            }
        })
    }

    private isHashExists(hash: string): void | never {
        if (
            _HashRouter.routeList.every((route) => {
                return route.hash !== hash
            })
        )
            throw new Error(_HashRouter.messages.noSuchRoute(hash))
    }

    /** ROUTE WORK */

    private findRoute(hash: string, exact = false): OneRoute | undefined {
        return _HashRouter.routeList.find((route) => {
            return exact || route.exact ? route.hash === hash : hash.startsWith(route.hash)
        })
    }

    private insertRoute(route: HashRoute, same = false): void | never {
        route.hashes.forEach((hash) => {
            this.validateHash(hash)
            if (!same) {
                this.isHashUnique(hash)
            } else {
                this.remove([hash])
            }
            _HashRouter.routeList.push({
                callback: route.callback,
                exact: route.exact || true,
                hash,
            })
        })
    }

    /** INTERFACE */

    route(hash: string): _HashRouter {
        this.validateHash(hash)
        this.isHashExists(hash)
        this.blockHashchangeEvent = true
        window.location.hash = this.hashNormalizer(hash)
        this.hashchangeHandler()
        this.blockHashchangeEvent = false
        return this
    }

    add(route: HashRoute): _HashRouter {
        this.insertRoute(route, false)
        return this
    }

    put(route: HashRoute): _HashRouter {
        this.insertRoute(route, true)
        return this
    }

    remove(hashes: string[]): _HashRouter {
        _HashRouter.routeList = _HashRouter.routeList.filter((route) => {
            return !hashes.some((h) => h === route.hash)
        })
        return this
    }

    find(hashes: string[]): Array<OneRoute | null> {
        return hashes.map((hash) => {
            const route = this.findRoute(hash, true)
            return route || null
        })
    }
}
