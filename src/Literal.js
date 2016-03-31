import RDFNode                 from "./RDFNode.js";
import {xmlSchemaTypes as xsd} from "./xmlSchemaTypes.js";

/**
 * Turns the given value into a primitive value using the [Symbol.toPrimitive]
 * method if it exists.
 *
 * @param {*} v
 * The value to convert.
 *
 * @return {*}
 * The resulting primitive.
 *
 * @ignore
 */
function toPrimitive(v) {
    if (v === undefined || v === null) {
        return v;
    } else if (typeof v[Symbol.toPrimitive] === "function") {
        return v[Symbol.toPrimitive]("number");
    } else if (typeof v.valueOf === "function") {
        return v.valueOf();
    } else if (typeof v.toString === "function") {
        return v.toString();
    }
    return v;
}

/**
 * Lists how to convert a string to a specific datatype.
 *
 * @ignore
 */
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
};

/**
 * Represents an RDF literal.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#literals
 */
export default class Literal extends RDFNode {

    /**
     * @param {String} value
     * The value of this literal.
     *
     * @param {Object} options
     * Contains the remaining parameters.
     *
     * @param {String} [options.language=null]
     * The language of this literal.
     *
     * @param {String} [options.datatype=null]
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
                   this.datatype      === toCompare.datatype;
        }
        return toPrimitive(this) === toPrimitive(toCompare);
    }

    /**
     * @override
     */
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
    [Symbol.toPrimitive](hint = "default") {
        if (hint === "string") {
            return this.toString();
        }
        return toPrimitive(this.valueOf());
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
