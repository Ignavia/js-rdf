import {expect} from "chai";

import {PrefixMap} from "../src/rdf.js";

describe("PrefixMap", function () {
    beforeEach(function () {
        this.pm = new PrefixMap([
            ["ex", "http://example.org/"],
            ["foo", "http://foo.de/"],
            ["bar", "http://bar.com#"]
        ]);
    });

    describe("#set", function () {
        it("should connect the given prefix and IRI", function () {
            expect(this.pm.hasPrefix("ex")).to.be.true;
            expect(this.pm.hasPrefix("foo")).to.be.true;
            expect(this.pm.hasPrefix("bar")).to.be.true;
            expect(this.pm.hasIRI("http://example.org/"));
            expect(this.pm.hasIRI("http://foo.de/"));
            expect(this.pm.hasIRI("http://bar.com#"));
            expect(this.pm.size).to.equal(3);
        });

        it("should override previous connections", function () {
            this.pm.set("foo", "https://foo.de/");
            expect(this.pm.hasIRI("http://foo.de/")).to.be.false;
            expect(this.pm.hasIRI("https://foo.de/")).to.be.true;

            this.pm.set("emp", "http://example.org/");
            expect(this.pm.hasPrefix("ex")).to.be.false;
            expect(this.pm.hasPrefix("emp")).to.be.true;
        });
    });

    describe("#remove", function () {
        it("should remove the connection between the given prefix and its IRI", function () {
            this.pm.remove("ex");
            expect(this.pm.hasPrefix("ex")).to.be.false;
            expect(this.pm.hasIRI("http://example.org/")).to.be.false;
        });
    });

    describe("#resolve", function () {
        it("should return the IRI for a CURIE", function () {
            const r0 = this.pm.resolve("foo:bar");
            expect(r0).to.equal("http://foo.de/bar");

            const r1 = this.pm.resolve("bar:foo");
            expect(r1).to.equal("http://bar.com#foo");
        });

        it("should resolve a CURIE without prefix", function () {
            this.pm.setDefault("http://codelottery.eu#");

            const r0 = this.pm.resolve(":world");
            expect(r0).to.equal("http://codelottery.eu#world");
        });
    });

    describe("#shrink", function () {
        it("should return the CURIE for an IRI", function () {
            const r0 = this.pm.shrink("http://foo.de/bar");
            expect(r0).to.equal("foo:bar");

            const r1 = this.pm.shrink("http://bar.com#foo");
            expect(r1).to.equal("bar:foo");
        });

        it("should shrink the default IRI", function () {
            this.pm.setDefault("http://codelottery.eu#");

            const r0 = this.pm.shrink("http://codelottery.eu#world");
            expect(r0).to.equal(":world");
        });
    });

    describe("#addAll", function () {
        it("should not override entries by default", function () {
            this.pm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http://example.org/"]
            ]);
            expect(this.pm.hasIRI("https://foo.de/")).to.be.false;
            expect(this.pm.hasPrefix("emp")).to.be.false;
        });

        it("should override entries if the corresponding parameter is set", function () {
            this.pm.addAll([
                ["foo", "https://foo.de/"],
                ["emp", "http://example.org/"]
            ]);
            expect(this.pm.hasIRI("https://foo.de/")).to.be.true;
            expect(this.pm.hasPrefix("emp")).to.be.true;
        });
    });

    describe("prefixes", function () {
        it("should yield the prefixes in the map", function () {
            const r0 = [...this.pm.prefixes()];
            expect(r0).to.have.members(["foo", "ex", "bar"]);
        });
    });

    describe("iris", function () {
        it("should yield the IRIs in the map", function () {
            const r0 = [...this.pm.iris()];
            expect(r0).to.have.members(["http://foo.de/", "http://example.org/", "http://bar.com#"]);
        });
    });

    describe("entries", function () {
        it("should yield the entries in the map", function () {
            const entries  = [...this.pm.entries()];
            const prefixes = entries.map(e => e[0]);
            const iris     = entries.map(e => e[1]);

            expect(prefixes).to.have.members(["foo", "ex", "bar"]);
            expect(iris).to.have.members(["http://foo.de/", "http://example.org/", "http://bar.com#"]);
        });
    });

    describe("clone", function () {
        it("should return a copy of this map", function () {
            const r0 = this.pm.clone();
            expect(r0).to.not.equal(this.pm);
            expect(r0.hasPrefix("foo")).to.be.true;
            expect(r0.hasIRI("http://example.org/")).to.be.true;
        });
    });

    after(function () {
        delete this.pm;
    });
});