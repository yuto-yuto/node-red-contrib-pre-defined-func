export interface ContextMethod {
    get: (...args: unknown[]) => unknown;
    set: (...args: unknown[]) => unknown;
}

export interface Context {
    flow: ContextMethod;
    global: ContextMethod;
}

export class FakeNode {
    private flow = {
        get: (..._args: unknown[]) => { throw new Error("Define the test behavior"); },
        set: (..._args: unknown[]) => { throw new Error("Define the test behavior"); },
    };
    private global = {
        get: (..._args: unknown[]) => { throw new Error("Define the test behavior"); },
        set: (..._args: unknown[]) => { throw new Error("Define the test behavior"); },
    };
    public context(): Context {
        return {
            flow: this.flow,
            global: this.global,
        };
    }
}