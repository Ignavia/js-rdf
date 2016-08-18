import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import {Graph, Triple, BlankNode, NamedNode, Literal, xmlSchemaTypes as xsd, TurtleReader} from "../src/index.js";

describe("TurtleReader", function () {
    beforeEach(function () {
        this.s0 = (`
            @prefix ex: <http://example.org#> .
            _:b1 <n1> "l1" .
            <b1> <n1> "1"^^<http://www.w3.org/2001/XMLSchema#integer> .
            _:b1 <n2> "l1"@en .
        `);

        this.s1 = "this is not valid";

        this.reader = new TurtleReader();
    });

    describe("#parse", function () {
        it("should parse valid turtle", function () {
            const t0 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t1 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("1", {datatype: xsd.integer}));
            const t2 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new Literal("l1", {language: "en"}));

            const p = this.reader.parse(this.s0);

            return p.then(({graph, profile}) => {
                expect(graph.hasTriple(t0)).to.be.true;
                expect(graph.hasTriple(t1)).to.be.true;
                expect(graph.hasTriple(t2)).to.be.true;
                expect(graph.length).to.equal(3);

                const prefixes = profile.prefixes;
                expect(prefixes.hasPrefix("ex")).to.be.true;
                expect(prefixes.hasNamespace("http://example.org#")).to.be.true;
                expect(prefixes.size).to.equal(1);
            });
        });

        it("should reject invalid input", function () {
            const p = this.reader.parse(this.s1);
            return expect(p).to.eventually.be.rejected;
        });
    });

    after(function () {
        delete this.s0;
        delete this.s1;
        delete this.reader;
    });
});

