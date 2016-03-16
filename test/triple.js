import {expect} from "chai";

import {Triple, BlankNode, Literal, NamedNode} from "../src/rdf.js";

describe("Triple", function () {
    describe("#equals", function () {
        it("should test if another triple is equivalent", function () {
            const t1 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t2 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t3 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));

            expect(t1.equals(t2)).to.be.false;
            expect(t1.equals(t3)).to.be.true;
        });
    });

    describe("#toString", function () {
        it("should return an N-Triples representation of this triple", function () {
            const t  = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
            expect(t.toString()).to.equal(`_:b1 <n1> "l1"`);
        });
    });
});