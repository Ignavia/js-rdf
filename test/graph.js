import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import sinon from "sinon";

import {Graph, Triple, BlankNode, NamedNode, Literal} from "../src/rdf.js";

describe("Graph", function () {
    beforeEach(function () {
        this.t0 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        this.t1 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("l1"));
        this.t2 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        this.t3 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new NamedNode("n1"));
        this.g0 = new Graph([this.t0, this.t1, this.t2, this.t3]);

        this.t4 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new NamedNode("n1"));
        this.g1 = new Graph([this.t3, this.t4]);
    });

    describe("#constructor", function () {
        it("should add the given triples to the graph", function () {
            expect(this.g0.has(this.t2)).to.be.true;
            expect(this.g0.has(this.t4)).to.be.false;
            expect(this.g0.length).to.equal(3);
        });
    });

    describe("#add", function () {
        it("should add the triple to the graph", function () {
            this.g0.add(this.t4);
            expect(this.g0.has(this.t4)).to.be.true;
            expect(this.g0.length).to.equal(4);
        });
    });

    describe("#addAll", function () {
        it("should add all triples from the given graph", function () {
            this.g0.addAll(this.g1);
            expect(this.g0.has(this.t4)).to.be.true;
            expect(this.g0.length).to.equal(4);
        });
    });

    describe("#has", function () {
        it("should test if a triple or an equivalent one exists", function () {
            expect(this.g0.has(this.t0)).to.be.true;
            expect(this.g0.has(this.t2)).to.be.true;
        });
    });

    describe("#remove", function () {
        it("should remove the given triple", function () {
            this.g0.remove(this.t2);
            expect(this.g0.has(this.t0)).to.be.false;
            expect(this.g0.has(this.t2)).to.be.false;
            expect(this.g0.length).to.equal(2);
        });
    });

    describe("#removeMatches", function () {
        it("should remove only triple with matching subjects", function () {
            // TODO
        });

        it("should remove only triples with matching predicates", function () {
            // TODO
        });

        it("should remove only triples with matching objects", function () {
            // TODO
        });
    });

    describe("#merge", function () {
        it("should return a new graph containing the triples from both graphs", function () {
            const r0 = this.g0.merge(g2);

            expect(r0.has(this.t0)).to.be.true;
            expect(r0.has(this.t4)).to.be.true;
            expect(r0.length).to.equal(4);
        });

        it("should leave the original graphs unchanged", function () {
            this.g0.merge(g2);

            expect(g0.length).to.equal(3);
            expect(g1.length).to.equal(1);
        });
    });

    describe("#match", function () {
        it("should include only triple with matching subjects", function () {
            // TODO
        });

        it("should include only triples with matching predicates", function () {
            // TODO
        });

        it("should include only triples with matching objects", function () {
            // TODO
        });
    });

    describe("#some", function () {
        it("should test if some triples in the graph fulfill the predicate", function () {
            const r0 = this.g0.some(t => t.subject.nominalValue !== "b1");
            expect(r0).to.be.false;
        });
    });

    describe("#every", function () {
        it("should test if all triples in the graph fulfill the predicate", function () {
            const r0 = this.g0.every(t => t.subject.nominalValue === "b1");
            expect(r0).to.be.true;
        });
    });

    describe("#filter", function () {
        it("should return a graph containing only matching triples", function () {
            const r0 = this.g0.filter(t => t.subject.interfaceName === "BlankNode");
            expect(r0.has(this.t0)).to.be.true;
            expect(r0.has(this.t3)).to.be.true;
            expect(r0.length).to.equal(2);
        });

        it("should leave the original graph unchanged", function () {
            this.g0.filter(() => false);
            expect(this.g0.length).to.equal(3);
        });
    });

    describe("#forEach", function () {
        it("should call the function with all triples in the graph", function () {
            const spy = sinon.spy();

            this.g0.forEach(spy);
            expect(spy).to.have.been.calledThrice;
        });
    });

    describe("#clear", function () {
        it("should remove all triples from the graph", function () {
            this.g0.clear();
            expect(g0.length).to.equal(0);
        });
    });

    describe("#literals", function () {
        it("should yield all triples with the given subject and a literal object", function () {
            const r0 = [...this.g0.literals(new BlankNode("b1"))];
            expect(r0).to.have.members([this.t2]);
        });
    });

    describe("#[Symbol.iterator]", function () {
        it("should yield all triples in the graph", function () {
            const r0 = [...this.g0];
            expect(r0).to.have.members([this.t0, this.t1, this.t3]);
        });
    });

    describe("#toArray", function () {
        it("should return an array with all triples of this graph", function () {
            const r0 = this.g0.toArray();
            expect(r0).to.have.members(this.t0, this.t1, this.t3);
        });
    });

    describe("#toString", function () {
        it("should return a textual representation of this graph", function () {
            expect(this.g0.toString()).to.be.a("string");
        });
    });

    after(function () {
        delete this.t0;
        delete this.t1;
        delete this.t2;
        delete this.t3;
        delete this.t4;
        delete this.g;
    });
});