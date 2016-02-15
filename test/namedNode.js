import {expect} from "chai";

import {BlankNode, Literal, NamedNode} from "../src/rdf.js";

/** @test {NamedNode} */
describe("NamedNode", function () {

    /** @test {NamedNode#equals} */
    describe("#equals", function () {
        it("should compare this node to another RDFNode by comparing their attributes", function () {
            const n1 = new NamedNode("n1"),
                  n2 = new NamedNode("n2"),
                  n3 = new NamedNode("n1"),
                  l  = new Literal("n1"),
                  b  = new BlankNode("n1");

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

    /** @test {NamedNode#valueOf} */
    describe("#valueOf", function () {
        it("should return the stringified nominalValue", function () {
            const n = new NamedNode("n");
            expect(n.valueOf()).to.equal("n");
        });
    });

    /** @test {NamedNode#toString} */
    describe("#toString", function () {
        it("should return the stringified nominalValue", function () {
            const n = new NamedNode("n");
            expect(n.toString()).to.equal("n");
        })
    });

    /** @test {NamedNode#toNT} */
    describe("#toNT", function () {
        it("should return the N-Triples representation", function () {
            const n = new NamedNode("n");
            expect(n.toNT()).to.equal("<n>");
        });
    });
});