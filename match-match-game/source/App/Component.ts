type ConstructorType<T> = T & {
    '@@Initialized'?: boolean
}

type StorageType = 'sessionStorage' | 'localStorage'

export abstract class Component {
    constructor() {
        const windowLink = window as { [key: string]: any }
        if (!windowLink['@@Events']) windowLink['@@Events'] = {}
    }

    abstract getHtml(): string
    protected onCreated<T>(ClassConstructor: ConstructorType<T>, callback: () => any) {
        if (ClassConstructor['@@Initialized'] !== true) {
            ClassConstructor['@@Initialized'] = true
            setTimeout(callback)
        }
    }

    static storageState<T extends Object>(
        initialState: T,
        storageName: string,
        storageType: StorageType = 'sessionStorage'
    ) {
        const proxy = new Proxy(initialState, {
            set(target: any, prop: any, value: any) {
                target[prop] = value
                if (storageType === 'sessionStorage') {
                    sessionStorage.setItem(storageName, JSON.stringify(proxy))
                }
                if (storageType === 'localStorage') {
                    localStorage.setItem(storageName, JSON.stringify(proxy))
                }
                return true
            },
            get(target: any, prop: any): Object {
                if (typeof target[prop] === 'object' && target[prop] !== null) {
                    return new Proxy(target[prop], this)
                }
                return target[prop]
            },
        })
        return proxy
    }
}
