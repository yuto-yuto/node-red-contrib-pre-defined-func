import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import { ExampleFunction } from "../lib/StoredFunctions/ExampleFunction";
import { FakeNode } from "./FakeNode";

describe("ExampleFunction", () => {
    let instance: ExampleFunction;
    let fakeNode: FakeNode;

    beforeEach(() => {
        sinon.stub(console, "info");
        fakeNode = new FakeNode();
        instance = new ExampleFunction(fakeNode as any);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("execute", () => {
        it("should return undefined if it receives a message", () => {
            const result = instance.execute({ _msgid: "111", payload: 1, topic: "First" }, sinon.stub());
            expect(result).to.be.undefined;
        });
        it("should return undefined if it receives two messages", () => {
            instance.execute({ _msgid: "111", payload: 1, topic: "First" }, sinon.stub());
            const result = instance.execute({ _msgid: "222", payload: 2, topic: "Second" }, sinon.stub());
            expect(result).to.be.undefined;
        });
        it("should return undefined if it receives three messages but different topic", () => {
            instance.execute({ _msgid: "111", payload: 1, topic: "First" }, sinon.stub());
            instance.execute({ _msgid: "222", payload: 2, topic: "Second" }, sinon.stub());
            const result = instance.execute({ _msgid: "333", payload: 3, topic: "unknown" }, sinon.stub());
            expect(result).to.be.undefined;
        });
        it("should return max value if it receives three messages", () => {
            sinon.stub(fakeNode.context().flow, "set");
            instance.execute({ _msgid: "111", payload: 1, topic: "First" }, sinon.stub());
            instance.execute({ _msgid: "222", payload: 22, topic: "Second" }, sinon.stub());
            const result = instance.execute({ _msgid: "333", payload: 3, topic: "Third" }, sinon.stub());
            expect(result?.payload).to.equal(22);
        });
        it("should set data to flow context", () => {
            const stub = sinon.stub(fakeNode.context().flow, "set");
            instance.execute({ _msgid: "111", payload: 1, topic: "First" }, sinon.stub());
            instance.execute({ _msgid: "222", payload: 22, topic: "Second" }, sinon.stub());
            instance.execute({ _msgid: "333", payload: 3, topic: "Third" }, sinon.stub());
            expect(stub.calledWith("Example-Max", 22)).to.be.true;
        });
    });
});
