import {expect} from "chai";

import {Graph, Triple, BlankNode, NamedNode, Literal, xmlSchemaTypes as xsd, TurtleWriter} from "../src/rdf.js";

describe("TurtleWriter", function () {
    beforeEach(function () {
        const t0 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        const t1 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("1", {datatype: xsd.integer}));
        const t2 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        const t3 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new NamedNode("n1"));
        this.g0 = new Graph([t0, t1, t2, t3]);

        this.writer = new TurtleWriter();
    });

    describe("#serialize", function () {
        it("should add the triple to the graph", function () {
            console.log(this.writer.serialize(this.g0))
        });
    });

    after(function () {
        delete this.g;
    });
});