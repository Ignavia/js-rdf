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
            expect(this.pm.hasTerm("ex")).to.be.true;
            expect(this.pm.hasTerm("foo")).to.be.true;
            expect(this.pm.hasTerm("bar")).to.be.true;
            expect(this.pm.hasIRI("http://example.org/"));
            expect(this.pm.hasIRI("http://foo.de/"));
            expect(this.pm.hasIRI("http://bar.com#"));
        });

        it("should override previous connections", function () {
            this.pm.set("foo", "https://foo.de/");
            expect(this.pm.hasIRI("http://foo.de/")).to.be.false;
            expect(this.pm.hasIRI("https://foo.de/")).to.be.true;

            this.pm.set("emp", "http://example.org/");
            expect(this.pm.hasTerm("ex")).to.be.false;
            expect(this.pm.hasTerm("emp")).to.be.true;
        });
    });

    describe("#remove", function () {
        it("should remove the connection between the given term and its IRI", function () {
            this.pm.remove("ex");
            expect(this.pm.hasTerm("ex")).to.be.false;
            expect(this.pm.hasIRI("http://example.org/")).to.be.false;
        });
    });

    describe("#resolve", function () {
        it("should return the IRI for a term", function () {
            const r0 = this.pm.resolve("foo");
            expect(r0).to.equal("http://foo.de/");

            const r1 = this.pm.resolve("bar");
            expect(r1).to.equal("http://bar.com#");
        });

        it("should return the default IRI if nothing was found", function () {
            this.pm.setDefault("http://codelottery.eu#");

            const r0 = this.pm.resolve("world");
            expect(r0).to.equal("http://codelottery.eu#world");
        });
    });

    describe("#shrink", function () {
        it("should return the term for an IRI", function () {
            const r0 = this.pm.shrink("http://foo.de/");
            expect(r0).to.equal("foo");

            const r1 = this.pm.shrink("http://bar.com#");
            expect(r1).to.equal("bar");
        });
    });

    describe("#addAll", function () {
        it("should not override entries by default", function () {
            this.pm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http:example.org/"]
            ]);
            expect(this.pm.hasTerm("https://foo.de/")).to.be.false;
            expect(this.pm.hasPrefix("emp")).to.be.false;
        });

        it("should override entries if the corresponding parameter is set", function () {
            this.pm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http:example.org/"]
            ]);
            expect(this.pm.hasTerm("https://foo.de/")).to.be.true;
            expect(this.pm.hasPrefix("emp")).to.be.true;
        });
    });

    describe("terms", function () {
        const r0 = [...this.pm.terms()];
        expect(r0).to.have.members(["foo", "ex", "bar"]);
    });

    describe("iris", function () {
        const r0 = [...this.pm.iris()];
        expect(r0).to.have.members(["http://foo.de/", "http:example.org/", "http://bar.com#"]);
    });

    describe("entries", function () {
        const entries  = [...this.pm.entries()];
        const terms = entries.map(e => e[0]);
        const iris     = entries.map(e => e[1]);

        expect(terms).to.have.members(["foo", "ex", "bar"]);
        expect(iris).to.have.members(["http://foo.de/", "http:example.org/", "http://bar.com#"]);
    });

    after(function () {
        delete this.tm;
    });
});