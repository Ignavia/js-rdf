import {expect} from "chai";

import {Profile, PrefixMap, TermMap} from "../src/rdf.js";

describe("PrefixMap", function () {
    beforeEach(function () {
        const prefixes = new PrefixMap([
            ["ex", "http://example.org/"],
            ["foo", "http://foo.de/"],
            ["bar", "http://bar.com#"]
        ]);

        const terms = new TermMap([
            ["ex", "http://example.org/"],
            ["foo", "http://foo.de/"],
            ["bar", "http://bar.com#"]
        ]);

        this.p = new Profile(prefixes, terms);
    });

    describe("#resolve", function () {
        it("should return the IRI for a CURIE", function () {
            const r0 = this.p.resolve("foo:bar");
            expect(r0).to.equal("http://foo.de/bar");

            const r1 = this.p.resolve("bar:foo");
            expect(r1).to.equal("http://bar.com#foo");
        });

        it("should resolve a CURIE without prefix", function () {
            this.p.setDefaultPrefix("http://codelottery.eu#");

            const r0 = this.p.resolve(":world");
            expect(r0).to.equal("http://codelottery.eu#world");
        });

        it("should return the IRI for a term", function () {
            const r0 = this.p.resolve("foo");
            expect(r0).to.equal("http://foo.de/");

            const r1 = this.p.resolve("bar");
            expect(r1).to.equal("http://bar.com#");
        });

        it("should return the default IRI if nothing was found", function () {
            this.p.setDefaultVocabulary("http://codelottery.eu#");

            const r0 = this.p.resolve("world");
            expect(r0).to.equal("http://codelottery.eu#world");
        });
    });

    after(function () {
        delete this.p;
    });
});