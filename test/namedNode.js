import {expect} from "chai";

import {BlankNode, Literal, NamedNode} from "../src/rdf.js";

describe("NamedNode", function () {
    describe("#equals", function () {
        it("should compare this node to another RDFNode by comparing their attributes", function () {
            const n1 = new NamedNode("n1");
            const n2 = new NamedNode("n2");
            const n3 = new NamedNode("n1");
            const l  = new Literal("n1");
            const b  = new BlankNode("n1");

            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
            expect(n1.equals(l)).to.be.false;
            expect(n1.equals(b)).to.be.false;
        });

        it("should compare this node to a non-RDFNode value by calling the valueOf method", function () {
            const n = new NamedNode("n");
            expect(n.equals("n")).to.be.true;
        });
    });

    describe("#valueOf", function () {
        it("should return the stringified nominalValue", function () {
            const n = new NamedNode("n");
            expect(n.valueOf()).to.equal("n");
        });
    });

    describe("#toString", function () {
        it("should return the stringified nominalValue", function () {
            const n = new NamedNode("n");
            expect(n.toString()).to.equal("n");
        });
    });

    describe("#toNT", function () {
        it("should return the N-Triples representation", function () {
            const n = new NamedNode("n");
            expect(n.toNT()).to.equal("<n>");
        });
    });
});