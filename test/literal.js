import {expect} from "chai";

import {BlankNode, Literal, NamedNode, xmlSchemaTypes as xsd} from "../src/index.js";

describe("Literal", function () {
    describe("#equals", function () {
        it("should compare this node to another RDFNode by comparing their attributes", function () {
            const l1 = new Literal("l1");
            const l2 = new Literal("l2");
            const l3 = new Literal("l1");
            const b  = new BlankNode("l1");
            const n  = new NamedNode("l1");

            expect(l1.equals(l2)).to.be.false;
            expect(l1.equals(l3)).to.be.true;
            expect(l1.equals(b)).to.be.false;
            expect(l1.equals(n)).to.be.false;
        });

        it("should compare this node to a non-RDFNode value by calling the valueOf method", function () {
            const l1 = new Literal("l1");
            const l2 = new Literal("false",                     {datatype: xsd.boolean});
            const l3 = new Literal("true",                      {datatype: xsd.boolean});
            const l4 = new Literal("4",                         {datatype: xsd.integer});
            const l5 = new Literal("2016-02-15",                {datatype: xsd.date});
            const l6 = new Literal("2016-02-15T08:57:48+00:00", {datatype: xsd.dateTime});

            expect(l1.equals("l1")).to.be.true;
            expect(l2.equals(false)).to.be.true;
            expect(l3.equals(true)).to.be.true;
            expect(l4.equals(4)).to.be.true;
            expect(l5.equals(new Date("2016-02-15"))).to.be.true;
            expect(l6.equals(new Date("2016-02-15T08:57:48+00:00"))).to.be.true;
        });
    });

    describe("#valueOf", function () {
        it("should return language native value of the nominalValue", function () {
            const l1 = new Literal("l1");
            const l2 = new Literal("false",                     {datatype: xsd.boolean});
            const l3 = new Literal("true",                      {datatype: xsd.boolean});
            const l4 = new Literal("4",                         {datatype: xsd.integer});
            const l5 = new Literal("2016-02-15",                {datatype: xsd.date});
            const l6 = new Literal("2016-02-15T08:57:48+00:00", {datatype: xsd.dateTime});

            expect(l1.valueOf()).to.equal("l1");
            expect(l2.valueOf()).to.equal(false);
            expect(l3.valueOf()).to.equal(true);
            expect(l4.valueOf()).to.equal(4);
            expect(l5.valueOf().getTime()).to.equal(new Date("2016-02-15").getTime());
            expect(l6.valueOf().getTime()).to.equal(new Date("2016-02-15T08:57:48+00:00").getTime());
        });
    });

    describe("#toString", function () {
        it("should return the stringified nominalValue", function () {
            const l = new Literal("l");
            expect(l.toString()).to.equal("l");
        });
    });

    describe("#toNT", function () {
        it("should return the N-Triples representation", function () {
            const l1 = new Literal("l1");
            expect(l1.toNT()).to.equal(`"l1"^^<http://www.w3.org/2001/XMLSchema#string>`);

            const l2 = new Literal("l2", {language: "de"});
            expect(l2.toNT()).to.equal(`"l2"@de`);

            const l3 = new Literal("l3", {
                datatype: new NamedNode(xsd.integer)
            });
            expect(l3.toNT()).to.equal(`"l3"^^<http://www.w3.org/2001/XMLSchema#integer>`);
        });
    });
});