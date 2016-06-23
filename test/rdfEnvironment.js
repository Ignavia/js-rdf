import {expect} from "chai";

import {RDFEnvironment, BlankNode, NamedNode} from "../src/index.js";

describe("RDFEnvironment", function () {
    beforeEach(function () {
        this.env = new RDFEnvironment();
        this.env.setPrefix("ex", "http://example.org/");
        this.env.setTerm("ex", "http://example.org/");
    });

    describe("#constructor", function () {
        it("should offer some common prefix-IRI-mappings", function () {
            const prefixes = this.env.prefixes;
            expect(prefixes.hasPrefix("owl")).to.be.true;
            expect(prefixes.hasNamespace("http://www.w3.org/ns/rdfa#")).to.be.true;
        });
    });

    describe("#createBlankNode", function () {
        it("should create a new BlankNode", function () {
            const r0 = this.env.createBlankNode();
            expect(r0).to.be.an.instanceof(BlankNode);
        });
    });

    describe("#createNamedNode", function () {
        it("should create a new NamedNode for an IRI", function () {
            const r0 = this.env.createNamedNode("http://example.org/");
            expect(r0).to.be.an.instanceof(NamedNode);
            expect(r0.nominalValue).to.equal("http://example.org/");
        });

        it("should create a new NamedNode for a CURIE", function () {
            const r0 = this.env.createNamedNode("ex:foo");
            expect(r0).to.be.an.instanceof(NamedNode);
            expect(r0.nominalValue).to.equal("http://example.org/foo");
        });

        it("should create a new NamedNode for a term", function () {
            const r0 = this.env.createNamedNode("ex");
            expect(r0).to.be.an.instanceof(NamedNode);
            expect(r0.nominalValue).to.equal("http://example.org/");
        });
    });

    after(function () {
        delete this.env;
    });
});