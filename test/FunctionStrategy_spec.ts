import "mocha";

import { expect, use } from "chai";
import * as sinon from "sinon";
import * as NodeRed from "node-red";

import { FunctionStrategy } from "../lib/StoredFunctions/FunctionStrategy";

class TestStrategy extends FunctionStrategy<NodeRed.NodeMessage> {
    public executeInternal(_msg: NodeRed.NodeMessage, _send: any): any {
        return 11;
    }
}

describe("FunctionStrategy", () => {
    let instance: TestStrategy;

    beforeEach(() => {
        instance = new TestStrategy({} as any);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("execute", () => {
        it("should return the returned value of executeInternal", () => {
            const result = instance.execute({ payload: 123 }, sinon.fake());
            expect(result).to.equal(11);
        });

        it("should write error log if executeInternal throws an error", () => {
            const stub = sinon.stub(console, "error");
            try {
                sinon.stub(instance, "executeInternal").throws("internal-error");

                instance.execute({ payload: 123 }, sinon.fake());
                expect(stub.firstCall.firstArg).to.include("internal-error");
            } finally {
                stub.restore();
            }
        });

        it("should return null if executeInternal throws an error", () => {
            const stub = sinon.stub(console, "error");
            try {
                sinon.stub(instance, "executeInternal").throws("internal-error");
                const result = instance.execute({ payload: 123 }, sinon.fake());
                expect(result).to.be.null;
            } finally {
                stub.restore();
            }
        });
    });
});
