import * as NodeRed from "node-red";

import { ExampleFunction } from "./ExampleFunction";
import { FunctionStrategy } from "./FunctionStrategy";

export type PreDefinedFunctions = "Example";

/**
 * Select a proper function depending on the value of funcName.
 * @param node 
 * @param funcName 
 * @returns 
 */
export function selectFunc(node: NodeRed.Node, funcName: PreDefinedFunctions): FunctionStrategy<NodeRed.NodeMessage> {
    switch (funcName) {
        case "Example": return new ExampleFunction(node);
        default: {
            // if there is a missing definition, the transpiler tells us the error
            const check: never = funcName;
            throw new Error(check);
        }
    }
}
