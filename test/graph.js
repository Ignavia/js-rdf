import {expect} from "chai";

import {Graph, Triple, BlankNode, NamedNode, Literal} from "../src/rdf.js";

describe("Graph", function () {

    beforeEach(function () {
        this.g = new Graph([
            new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1")),
            new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("l1")),
            new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"))
        ]);
    });

    describe("#add", function () {
        it("should add the triples", function () {
            expect(this.g.length).to.equal(3);
        });
    });

    describe("#addAll", function () {

    });

    describe("#remove", function () {

    });

    describe("#removeMatches", function () {

    });

    describe("#merge", function () {

    });

    describe("#match", function () {

    });

    describe("#some", function () {

    });

    describe("#every", function () {

    });

    describe("#filter", function () {

    });

    describe("#forEach", function () {

    });

    describe("#clear", function () {

    });

    describe("#iterLiterals", function () {

    });

    describe("#[Symbol.iterator]", function () {

    });

    describe("#toArray", function () {

    });

    describe("#toString", function () {

    });

    after(function () {
        delete this.g;
    });
});