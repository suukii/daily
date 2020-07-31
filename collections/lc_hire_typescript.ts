interface Action<T> {
    payload?: T;
    type: string;
}

class EffectModule {
    count = 1;
    message = 'hello!';

    delay(input: Promise<number>) {
        return input.then(i => ({
            payload: `hello ${i}!`,
            type: 'delay',
        }));
    }

    setMessage(action: Action<Date>) {
        return {
            payload: action.payload!.getMilliseconds(),
            type: 'set-message',
        };
    }
}

type PickFuncKey<F> = {
    [P in keyof F]: F[P] extends Function ? P : never;
}[keyof F];

type MakeConnected<M> = {
    [P in PickFuncKey<M>]: M[P] extends (
        action: Action<infer T>,
    ) => Action<infer U>
        ? (action: T) => Action<U>
        : M[P] extends (input: Promise<infer T>) => Promise<Action<infer U>>
        ? (input: T) => Action<U>
        : never;
};

type Connect = (module: EffectModule) => MakeConnected<typeof module>;

const connect: Connect = m => ({
    delay: (input: number) => ({
        type: 'delay',
        payload: `hello 2`,
    }),
    setMessage: (input: Date) => ({
        type: 'set-message',
        payload: input.getMilliseconds(),
    }),
});

type Connected = {
    delay(input: number): Action<string>;
    setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());
