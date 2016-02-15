import RDFNode                 from "./RDFNode.js";
import {xmlSchemaTypes as xsd} from "./xmlSchemaTypes.js";

const converter = {
    [xsd.string]:             (s) => s,
    [xsd.boolean]:            (s) => s === "true",
    [xsd.dateTime]:           (s) => new Date(s),
    [xsd.date]:               (s) => new Date(s),
    //[xsd.time]:               (s) => new Date(s),
    [xsd.double]:             (s) => Number(s),
    [xsd.float]:              (s) => Number(s),
    [xsd.decimal]:            (s) => Number(s),
    [xsd.positiveInteger]:    (s) => Number(s),
    [xsd.nonNegativeInteger]: (s) => Number(s),
    [xsd.integer]:            (s) => Number(s),
    [xsd.nonPositiveInteger]: (s) => Number(s),
    [xsd.negativeInteger]:    (s) => Number(s),
    [xsd.long]:               (s) => Number(s),
    [xsd.int]:                (s) => Number(s),
    [xsd.short]:              (s) => Number(s),
    [xsd.byte]:               (s) => Number(s),
    [xsd.unsignedLong]:       (s) => Number(s),
    [xsd.unsignedInt]:        (s) => Number(s),
    [xsd.unsignedShort]:      (s) => Number(s),
    [xsd.unsignedByte]:       (s) => Number(s)
}

/**
 * Represents an RDF literal.
 */
export default class Literal extends RDFNode {

    /**
     * @param {String} value
     * The value of this literal.
     *
     * @param {String} [language=null]
     * The language of this literal.
     *
     * @param {String} [datatype=null]
     * The datatype of this literal.
     */
    constructor(value, {language = null, datatype = null} = {}) {
        super("Literal", value);

        /**
         * The language of this literal.
         *
         * @type {String}
         */
        this.language = language;

        /**
         * The datatype of this literal.
         *
         * @type {String}
         */
        this.datatype = datatype;
    }

    /**
     * @override
     */
    equals(toCompare) {
        if (toCompare instanceof RDFNode) {
            return this.interfaceName === toCompare.interfaceName &&
                   this.nominalValue  === toCompare.nominalValue  &&
                   this.language      === toCompare.language      &&
                   this.equalDatatypes(toCompare);

        }
        return this.normalize(this.valueOf()) === this.normalize(toCompare);
    }

    /**
     * Tests if the given literal has the same datatype as this one.
     *
     * @param {Literal} toCompare
     * The literal to compare to this one.
     *
     * @return {Boolean}
     * If the two literals have the dame datatypes.
     *
     * @private
     */
    equalDatatypes(toCompare) {
        return (this.datatype === null && toCompare.datatype === null) ||
               (this.datatype.equals(toCompare.datatype));
    }

    normalize(p) {
        if (p instanceof Date) {
            return p.getTime();
        }
        return p;
    }

    valueOf() {
        if (this.language === null && this.datatype !== null && converter[this.datatype.toString()]) {
            return converter[this.datatype.toString()](this.nominalValue);
        }
        return this.nominalValue;
    }

    /**
     * @override
     */
    toString() {
        return `${this.nominalValue}`;
    }

    /**
     * @override
     */
    toNT() {
        if (this.language !== null) {
            return `"${this.nominalValue}@${this.language}"`;
        } else if (this.datatype !== null) {
            return `"${this.nominalValue}^^${this.datatype}"`;
        } else {
            return `"${this.nominalValue}"`;
        }
    }
}
