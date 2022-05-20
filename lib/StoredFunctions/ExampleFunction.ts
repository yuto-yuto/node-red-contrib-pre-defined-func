import * as NodeRed from "node-red";
import { FunctionStrategy } from "./FunctionStrategy";

type ExamplePayload = NodeRed.NodeMessageInFlow & { payload: number };

/**
 * Example to join 3 messages
 */
export class ExampleFunction extends FunctionStrategy<ExamplePayload> {
    private firstValue?: number;
    private secondValue?: number;
    private thirdValue?: number;

    protected executeInternal(msg: ExamplePayload, send: any): any {
        // Implement you logic here
        if (msg.topic === "First") {
            this.firstValue = msg.payload;
        }

        if (msg.topic === "Second") {
            this.secondValue = msg.payload;
        }

        if (msg.topic === "Third") {
            this.thirdValue = msg.payload;
        }

        if (msg.topic === "error") {
            throw new Error("Error is handled in the base class.");
        }

        if (msg.topic === "multi") {
            // multi payloads can be sent in this way.
            send([[
                { payload: "first" },
                { payload: "second" },
            ]]);
            // Don't forget to return here.
            return null;
        }

        // send data only all the three data come to this node
        if (
            this.firstValue !== undefined &&
            this.secondValue !== undefined &&
            this.thirdValue !== undefined
        ) {
            const max = Math.max(this.firstValue, this.secondValue, this.thirdValue);

            // Store the info in flow level. This info can be accessed from the other nodes on a flow.
            this.flow.set("Example-Max", max);
            msg.payload = max;

            // Returned value will be sent in StoredFuncNode.
            return msg;
        }

        console.info("The message cannot be sent yet.");

        // otherwise, returns null or undefined. Null and undefined won't be sent.
        return undefined;
    }
}
