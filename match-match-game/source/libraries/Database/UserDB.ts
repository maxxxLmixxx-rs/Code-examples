import { User } from './User.d'

type DBUser = User & {
    created: Date
}

export class UserDB {
    static DB_NAME = 'maxxxLmixxx-rs'
    static USERS_STORE = 'users'
    static errors = {
        notCreated: 'UserDB was not created yet',
        wasDeleted: `${UserDB.DB_NAME} was deleted`,
    }

    private database: Promise<IDBDatabase>

    constructor() {
        this.database = this.open()
    }

    resolve<T>(value?: T) {
        return Promise.resolve(value)
    }

    open() {
        return (this.database = new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(UserDB.DB_NAME)
            openRequest.onupgradeneeded = (event: any) => this.onupgradeneeded(event)
            openRequest.onsuccess = (event: any) => resolve(this.onsuccess(event))
            openRequest.onerror = (event: any) => reject(this.onerror(event))
        }) as Promise<IDBDatabase>)
    }

    drop() {
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(UserDB.DB_NAME)
            deleteRequest.onsuccess = () => resolve(console.warn(UserDB.errors.wasDeleted))
            deleteRequest.onerror = () => reject(deleteRequest.error)
        }) as Promise<void | Error>
    }

    private onupgradeneeded(event: any) {
        const openRequest = event.target as IDBOpenDBRequest
        const database = openRequest.result
        if (!database.objectStoreNames.contains(UserDB.USERS_STORE)) {
            database.createObjectStore(UserDB.USERS_STORE, { keyPath: 'email' })
        }
    }

    private onerror(event: any) {
        const openRequest = event.target as IDBOpenDBRequest
        return openRequest.error
    }

    private onsuccess(event: any): Promise<IDBDatabase> {
        const openRequest = event.target as IDBOpenDBRequest
        return (this.database = Promise.resolve(openRequest.result))
    }

    private usersTransaction(
        action: (users: IDBObjectStore) => IDBRequest,
        type: 'readonly' | 'readwrite' = 'readonly'
    ): Promise<DBUser | void> {
        return this.database.then((database: IDBDatabase) => {
            const transaction = database.transaction(UserDB.USERS_STORE, type)
            const users = transaction.objectStore(UserDB.USERS_STORE)
            const request = action(users)
            return new Promise((resolve, reject) => {
                if (type === 'readonly') {
                    request.onsuccess = () => resolve(request.result)
                } else {
                    request.onsuccess = () => resolve()
                }
                request.onerror = () => reject(request.error)
            })
        })
    }

    add(user: User) {
        return this.usersTransaction((users) => {
            return users.add({ ...user, image: user.image || null, created: new Date() })
        }, 'readwrite') as Promise<void>
    }

    put(user: User) {
        return this.usersTransaction((users) => {
            return users.put({ ...user, image: user.image || null, created: new Date() })
        }, 'readwrite') as Promise<void>
    }

    delete(email: string) {
        return this.usersTransaction((users) => {
            return users.delete(email)
        }, 'readwrite') as Promise<void>
    }

    get(email: string) {
        return this.usersTransaction((users) => {
            return users.get(email)
        }, 'readonly') as Promise<User>
    }

    getAll(count = 10) {
        return this.usersTransaction((users) => {
            return users.getAll(null, count)
        }, 'readonly') as Promise<void | User[]>
    }
}
