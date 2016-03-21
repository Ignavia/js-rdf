import {expect} from "chai";

import {Graph, Triple, BlankNode, Literal, NamedNode} from "../src/rdf.js";

describe("Graph", function () {
    beforeEach(function () {
            const t1 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t2 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t3 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
    });

    describe("#add", function () {
        it("should compare this node to another RDFNode by comparing their attributes", function () {
            const b1 = new BlankNode("b1");
            const b2 = new BlankNode("b2");
            const b3 = new BlankNode("b1");
            const l  = new Literal("b1");
            const n  = new NamedNode("b1");

            expect(b1.equals(b2)).to.be.false;
            expect(b1.equals(b3)).to.be.true;
            expect(b1.equals(l)).to.be.false;
            expect(b1.equals(n)).to.be.false;
        });

        it("should compare this node to a non-RDFNode value by calling the valueOf method", function () {
            const b = new BlankNode("b");
            expect(b.equals("b")).to.be.true;
        });
    });

    describe("#valueOf", function () {
        it("should return the stringified nominalValue", function () {
            const b = new BlankNode("b");
            expect(b.valueOf()).to.equal("b");
        });
    });

    describe("#toString", function () {
        it("should return the stringified nominalValue with prepended _:", function () {
            const b = new BlankNode("b");
            expect(b.toString()).to.equal("_:b");
        });
    });

    describe("#toNT", function () {
        it("should return the N-Triples representation", function () {
            const b = new BlankNode("b");
            expect(b.toNT()).to.equal("_:b");
        });
    });
});