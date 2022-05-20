import * as NodeRed from "node-red";
import { PreDefinedFuncProperties } from "./NodeProperties";
import { PreDefinedFunctions, selectFunc } from "./StoredFunctions/FunctionSelector";

export = (RED: NodeRed.NodeAPI): void => {
    RED.nodes.registerType("pre-defined-func", function (this: NodeRed.Node, properties: PreDefinedFuncProperties) {
        RED.nodes.createNode(this, properties);

        const funcName = properties.funcName as PreDefinedFunctions;
        const strategy = selectFunc(this, funcName);

        this.on("input", (msg, send, done) => {
            const result = strategy.execute(msg, send);
            if (result !== undefined && result !== null) {
                msg = { ...msg, ...result };
                send(msg);
            }
            done();
        });

        this.on("close", (done: () => void) => {
            strategy.release();
            done();
        });
    });
};
