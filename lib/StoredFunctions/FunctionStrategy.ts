import * as NodeRed from "node-red";

/**
 * Apply Strategy Pattern. Each function class must be extended from this class.
 * Extend this class when you need to do for example the following
 *  - multiple nodes are necessary to implement the desired logic
 *  - some data need to be stored in a function node
 *  - the same logic need to be used in different flows
 * 
 * Flow tests take long time comparing to unit-tests.
 * Putting the logic into TypeScript code, writing the test becomes easy.
 * Additionally, it saves the flow test execution time.
 */
export abstract class FunctionStrategy<T extends NodeRed.NodeMessage> {
    constructor(protected node: NodeRed.Node) { }

    // Node-level context doesn't exist because it can be implemented in the sub-class.

    /**
     * Context of flow level. Visible to all nodes on the same tab.
     */
    protected get flow(): NodeRed.NodeContextData {
        return this.node.context().flow;
    }
    /**
     * Context of global level. Visible to all nodes in the flow file
     */
    protected get global(): NodeRed.NodeContextData {
        return this.node.context().global;
    }
    /**
     * Execute pre-defined function. A sub-class implements the logic here.
     * The returned value is sent to the next node(s) if it is not undefined or null.
     * @param msg Received message.
     * @param send Send a specified message to the next node.
     */
    public execute(msg: T, send: any): NodeRed.NodeMessageInFlow | null | undefined {
        try {
            return this.executeInternal(msg, send);
        } catch (e) {
            if (e instanceof Error) {
                // Replace this console with your logger if necessary
                console.error(`${e.message}\n${e.stack}`);
            }
            return null;
        }
    }

    /**
     * A sub-class implements the logic here.
     * The returned value is sent to the wired node(s) if it is not undefined or null.
     * If you need to send multiple payloads (array), use send function and returns null.
     * @param msg Received message.
     * @param send Send a specified message to the next node.
     */
    protected abstract executeInternal(msg: T, send: any): any;

    /**
     * Write release logic here if it's necessary
     */
    public release(): void {
        // Do nothing in abstract class
    }
}
