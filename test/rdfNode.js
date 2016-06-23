import {expect} from "chai";

import {RDFNode} from "../src/index.js";

describe("RDFNode", function () {
    describe("#fromNT", function () {
        it("should create an RDFNode from an N-Triples string", function () {
            const b  = RDFNode.fromNT("_:b");
            const l1 = RDFNode.fromNT(`"l1"`);
            const l2 = RDFNode.fromNT(`"l2"^^<type>`);
            const l3 = RDFNode.fromNT(`"l3"@de`);
            const n  = RDFNode.fromNT("<n>");

            expect(b.tempName).to.equal("b");
            expect(l1.value).to.equal("l1");
            expect(l2.value).to.equal("l2");
            expect(l2.datatype).to.equal("type");
            expect(l3.value).to.equal("l3");
            expect(l3.language).to.equal("de");
            expect(n.iri).to.equal("n");
        });

        it("should throw an error if the string cannot be parsed", function () {
            const f = () => RDFNode.fromNT("This is invalid");
            expect(f).to.throw;
        });
    });
});