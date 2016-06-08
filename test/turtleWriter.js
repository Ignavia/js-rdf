import {expect} from "chai";

import {Graph, Triple, BlankNode, NamedNode, Literal, xmlSchemaTypes as xsd, TurtleWriter} from "../src/rdf.js";

import {TurtleReader} from "../src/rdf.js";

describe("TurtleWriter", function () {
    beforeEach(function () {
        const t0 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        const t1 = new Triple(new NamedNode("b1"), new NamedNode("n1"), new Literal("1", {datatype: xsd.integer}));
        const t2 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l1"));
        const t3 = new Triple(new BlankNode("b1"), new NamedNode("n2"), new NamedNode("n1"));
        const t4 = new Triple(new BlankNode("b1"), new NamedNode("n1"), new Literal("l2"));
        this.g = new Graph([t0, t1, t2, t3, t4]);

        this.writer = new TurtleWriter();
    });

    describe("#serialize", function () {
        it("should return a string", function () {
            expect(this.writer.serialize(this.g)).to.be.a("string");
        });

        it("should parse valid turtle", async function (done) {
            try {
        const s = (`
@base <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rel: <http://www.perceive.net/schemas/relationship/> .

<#green-goblin>
    rel:enemyOf <#spiderman> ;
    a foaf:Person ;    # in the context of the Marvel universe
    foaf:name "Green Goblin" .

<#spiderman>
    rel:enemyOf <#green-goblin> ;
    a foaf:Person ;
    foaf:name "Spiderman", "Человек-паук"@ru .
        `);

        const reader = new TurtleReader();
        const result = await reader.parse(s);
        console.log(this.writer.serialize(result.graph, result.profile));
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    after(function () {
        delete this.g;
        delete this.writer;
    });
});