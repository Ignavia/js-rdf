import {expect} from "chai";

import {Graph, Triple, BlankNode, NamedNode, Literal, xmlSchemaTypes as xsd, TurtleReader} from "../src/rdf.js";

describe("TurtleReader", function () {
    beforeEach(function () {
        this.s = `_:b1 <n1> "l1"
            <b1> <n1> "1^^http://www.w3.org/2001/XMLSchema#integer"
            _:b1 <n2> <n1>`;
        this.reader = new TurtleReader();
    });

    describe("#parse", function () {
        it("should add the triple to the graph", function () {
            console.log(this.reader.parse(this.s))
        });
    });

    after(function () {
        delete this.g;
    });
});

