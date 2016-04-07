import chai, {expect} from "chai";

import {Graph, Triple, BlankNode, NamedNode, Literal, xmlSchemaTypes as xsd, TurtleReader} from "../src/rdf.js";

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
        it("should parse valid turtle", async function (done) {
            const t0 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
            const t1 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("1", {datatype: xsd.integer}));
            const t2 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new Literal("l1", {language: "en"}));
            try {
                const {graph, profile} = await this.reader.parse(this.s0);
                expect(graph.has(t0)).to.be.true;
                expect(graph.has(t1)).to.be.true;
                expect(graph.has(t2)).to.be.true;
                expect(graph.length).to.equal(3);

                const prefixes = profile.prefixes;
                expect(prefixes.hasPrefix("ex")).to.be.true;
                expect(prefixes.hasIRI("http://example.org#")).to.be.true;
                expect(prefixes.size).to.equal(1);
                done();
            } catch (err) {
                done(err);
            }
        });

        it("should reject invalid input", async function (done) {
            try {
                await this.reader.parse(this.s1);
                done(new Error("Accepted invalid input."));
            } catch (err) {
                done();
            }
        });
    });

    after(function () {
        delete this.s0;
        delete this.s1;
        delete this.reader;
    });
});

