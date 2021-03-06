type Promsified<T> = { [P in keyof T]: Promise<T[P]> }

export enum FetchMode {
    Lazy,
    Eager
}

export abstract class MitterObject<T extends Promsified<U>, U> {
    protected _ref: U | undefined
    private fetchCall: (() => Promise<U>) | undefined
    private mode: FetchMode = FetchMode.Lazy

    protected init(fetchCall: () => Promise<U>, mode: FetchMode = FetchMode.Lazy) {
        this.fetchCall = fetchCall
        this.mode = mode

        if (mode === FetchMode.Eager) {
            fetchCall().then(ref => {
                this._ref = ref
            })
        }
    }

    public sync(): Promise<U> {
        return this.fetchCall!().then(it => {
            this.setRef(it)
            return it
        })
    }

    public setRef(ref: U) {
        this._ref = ref
    }

    protected proxy<K extends keyof U>(key: K): Promise<U[K]> {
        if (this._ref !== undefined) {
            return Promise.resolve(this._ref[key])
        } else {
            return (
                this.sync()
                    // TODO. we probably need some deadlock prevention mechanism, this can ideally
                    // keep on going on forever
                    .then(it => {
                        this._ref = it
                        return this._ref[key]
                    })
            )
        }
    }
}
