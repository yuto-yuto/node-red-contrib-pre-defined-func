import "mocha";

import { expect } from "chai";
import * as sinon from "sinon";
import * as Selector from "../lib/StoredFunctions/FunctionSelector";

import { ExampleFunction } from "../lib/StoredFunctions/ExampleFunction";
import PreDefinedFuncNode = require("../lib/PreDefinedFuncNode");

const helper = require("node-red-node-test-helper");

describe("PreDefinedFuncNode", () => {
    let selector: ExampleFunction;
    function createFlow() {
        return [
            {
                id: "pre-func-id",
                type: "pre-defined-func",
                name: "pre-func-name",
                funcName: "function-name",
                wires: [["output-id"]],
            },
            {
                id: "output-id",
                type: "helper",
            },
        ];
    }

    before(() => {
        helper.init(require.resolve("node-red"));
    });

    beforeEach((done) => {
        selector = new ExampleFunction({} as any);
        sinon.stub(Selector, "selectFunc").returns(selector);
        helper.startServer(done);
    });

    afterEach((done) => {
        sinon.restore();
        helper.unload().then(() => helper.stopServer(done));
    });

    it("should be loaded", (done) => {
        const flow = createFlow();
        helper.load([PreDefinedFuncNode], flow, () => {
            const node = helper.getNode("pre-func-id");
            try {
                expect(node.name).to.equal("pre-func-name");
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("should pass the incoming msg to execute function", (done) => {
        const stub = sinon.stub(selector, "execute");
        stub.returns({ _msgid: "111" });

        const flow = createFlow();
        helper.load([PreDefinedFuncNode], flow, () => {
            const node = helper.getNode("pre-func-id");
            const outNode = helper.getNode("output-id");

            outNode.on("input", () => {
                try {
                    expect(stub.firstCall.firstArg).to.include({ payload: "something" });
                    done();
                } catch (e) {
                    done(e);
                }
            });
            node.receive({ payload: "something" });
        });
    });

    it("should send a payload if msg is not undefined or null", (done) => {
        sinon.stub(selector, "execute").returns({
            _msgid: "111",
            payload: "something",
        });

        const flow = createFlow();
        helper.load([PreDefinedFuncNode], flow, () => {
            const node = helper.getNode("pre-func-id");
            const outNode = helper.getNode("output-id");

            outNode.on("input", (msg: any) => {
                try {
                    expect(msg.payload).to.equal("something");
                    done();
                } catch (e) {
                    done(e);
                }

            });
            node.receive({ payload: "aaa" });
        });
    });
});
