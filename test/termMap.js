import {expect} from "chai";

import {TermMap} from "../src/rdf.js";

describe("TermMap", function () {
    beforeEach(function () {
        this.tm = new TermMap([
            ["ex", "http://example.org/"],
            ["foo", "http://foo.de/"],
            ["bar", "http://bar.com#"]
        ]);
    });

    describe("#set", function () {
        it("should connect the given term and IRI", function () {
            expect(this.tm.hasTerm("ex")).to.be.true;
            expect(this.tm.hasTerm("foo")).to.be.true;
            expect(this.tm.hasTerm("bar")).to.be.true;
            expect(this.tm.hasIRI("http://example.org/"));
            expect(this.tm.hasIRI("http://foo.de/"));
            expect(this.tm.hasIRI("http://bar.com#"));
            expect(this.tm.size).to.equal(3);
        });

        it("should override previous connections", function () {
            this.tm.set("foo", "https://foo.de/");
            expect(this.tm.hasIRI("http://foo.de/")).to.be.false;
            expect(this.tm.hasIRI("https://foo.de/")).to.be.true;

            this.tm.set("emp", "http://example.org/");
            expect(this.tm.hasTerm("ex")).to.be.false;
            expect(this.tm.hasTerm("emp")).to.be.true;
        });
    });

    describe("#remove", function () {
        it("should remove the connection between the given term and its IRI", function () {
            this.tm.remove("ex");
            expect(this.tm.hasTerm("ex")).to.be.false;
            expect(this.tm.hasIRI("http://example.org/")).to.be.false;
        });
    });

    describe("#resolve", function () {
        it("should return the IRI for a term", function () {
            const r0 = this.tm.resolve("foo");
            expect(r0).to.equal("http://foo.de/");

            const r1 = this.tm.resolve("bar");
            expect(r1).to.equal("http://bar.com#");
        });

        it("should return the default IRI if nothing was found", function () {
            this.tm.setDefault("http://codelottery.eu#");

            const r0 = this.tm.resolve("world");
            expect(r0).to.equal("http://codelottery.eu#world");
        });
    });

    describe("#shrink", function () {
        it("should return the term for an IRI", function () {
            const r0 = this.tm.shrink("http://foo.de/");
            expect(r0).to.equal("foo");

            const r1 = this.tm.shrink("http://bar.com#");
            expect(r1).to.equal("bar");
        });
    });

    describe("#addAll", function () {
        it("should not override entries by default", function () {
            this.tm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http://example.org/"]
            ]);
            expect(this.tm.hasIRI("https://foo.de/")).to.be.false;
            expect(this.tm.hasTerm("emp")).to.be.false;
        });

        it("should override entries if the corresponding parameter is set", function () {
            this.tm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http://example.org/"]
            ]);
            expect(this.tm.hasIRI("https://foo.de/")).to.be.true;
            expect(this.tm.hasTerm("emp")).to.be.true;
        });
    });

    describe("terms", function () {
        it("should yield the terms in the map", function () {
            const r0 = [...this.tm.terms()];
            expect(r0).to.have.members(["foo", "ex", "bar"]);
        });
    });

    describe("iris", function () {
        it("should yield the IRIs in the map", function () {
            const r0 = [...this.tm.iris()];
            expect(r0).to.have.members(["http://foo.de/", "http://example.org/", "http://bar.com#"]);
        });
    });

    describe("entries", function () {
        it("should yield the entries in the map", function () {
            const entries  = [...this.tm.entries()];
            const terms = entries.map(e => e[0]);
            const iris     = entries.map(e => e[1]);

            expect(terms).to.have.members(["foo", "ex", "bar"]);
            expect(iris).to.have.members(["http://foo.de/", "http://example.org/", "http://bar.com#"]);
        });
    });

    describe("clone", function () {
        it("should return a copy of this map", function () {
            const r0 = this.tm.clone();
            expect(r0).to.not.equal(this.tm);
            expect(r0.hasTerm("foo")).to.be.true;
            expect(r0.hasIRI("http://example.org/")).to.be.true;
        });
    });

    after(function () {
        delete this.tm;
    });
});