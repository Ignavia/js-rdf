import RDFNode                 from "./RDFNode.js";
import {xmlSchemaTypes as xsd} from "./xmlSchemaTypes.js";

const converter = {
    [xsd.string]:             String,
    [xsd.boolean]:            (s) => s === "true",
    [xsd.dateTime]:           (s) => new Date(s),
    [xsd.date]:               (s) => new Date(s),
    //[xsd.time]:               (s) => new Date(s),
    [xsd.double]:             Number,
    [xsd.float]:              Number,
    [xsd.decimal]:            Number,
    [xsd.positiveInteger]:    Number,
    [xsd.nonNegativeInteger]: Number,
    [xsd.integer]:            Number,
    [xsd.nonPositiveInteger]: Number,
    [xsd.negativeInteger]:    Number,
    [xsd.long]:               Number,
    [xsd.int]:                Number,
    [xsd.short]:              Number,
    [xsd.byte]:               Number,
    [xsd.unsignedLong]:       Number,
    [xsd.unsignedInt]:        Number,
    [xsd.unsignedShort]:      Number,
    [xsd.unsignedByte]:       Number
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
