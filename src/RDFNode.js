import {IDGenerator} from "@ignavia/util";

// import BlankNode from "./BlankNode.js";
// import Literal   from "./Literal.js";
// import NamedNode from "./NamedNode.js";

/**
 * Provides IDs for RDFNodes.
 *
 * @type {IDGenerator}
 * @ignore
 */
const idGenerator = new IDGenerator("n");

/**
 * Defines an interface for RDFNodes.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#nodes
 */
export default class RDFNode {

    // /**
    //  * Creates an appropriate RDFNode for an N-Triples string.
    //  *
    //  * @param {String} ntString
    //  * The N-Triples string to parse.
    //  *
    //  * @return {RDFNode}
    //  * The created RDFNode.
    //  *
    //  * @throws
    //  * If the string cannot be parsed.
    //  */
    // static fromNT(ntString) {
    //     if (BlankNode.isNTBlankNode(ntString)) {
    //         return BlankNode.fromNT(ntString);
    //     } else if (Literal.isNTLiteral(ntString)) {
    //         return Literal.fromNT(ntString);
    //     } else if (NamedNode.isNTNamedNode(ntString)) {
    //         return NamedNode.fromNT(ntString);
    //     } else {
    //         throw new Error(`Could not parse ${ntString}.`);
    //     }
    // }

    /**
     * @param {String} interfaceName
     * The string name of the current interface. This is one of "NamedNode",
     * "BlankNode" and "Literal".
     *
     * @param {*} nominalValue
     * The value of this RDFNode.
     */
    constructor(interfaceName, nominalValue) {

        /**
         * The string name of the current interface. This is one of "NamedNode",
         * "BlankNode" and "Literal".
         *
         * @type {String}
         */
        this.interfaceName = interfaceName;

        /**
         * The value of this RDFNode.
         *
         * @type {*}
         */
        this.nominalValue = nominalValue;

        /**
         * The ID of this RDFNode.
         *
         * @type {String}
         */
        this.id = idGenerator.next();
    }

    /**
     * Tests if this node is a blank node.
     *
     * @return {boolean}
     * If this node is a blank node.
     */
    isBlankNode() {
        return this.interfaceName === "BlankNode";
    }

    /**
     * Tests if this node is a literal.
     *
     * @return {boolean}
     * If this node is a literal.
     */
    isLiteral() {
        return this.interfaceName === "Literal";
    }

    /**
     * Tests if this node is a named node.
     *
     * @return {boolean}
     * If this node is a named node.
     */
    isNamedNode() {
        return this.interfaceName === "NamedNode";
    }

    /**
     * Tests if this RDFNode is equivalent to the given value.
     *
     * @param {*} toCompare
     * The value to test.
     *
     * @return {Boolean}
     * If this RDFNode is equivalent to the given value.
     *
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-equals-boolean-any-tocompare
     */
    equals(toCompare) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Provides access to the native value for this RDFNode.
     *
     * @return {*}
     * The native value of this RDFNode.
     *
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-valueOf-any
     */
    valueOf() {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Returns the stringification of this RDFNode.
     *
     * @return {String}
     * The stringification of this RDFNode.
     *
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString
     */
    toString() {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Returns the N-Triples representation of this RDFNode.
     *
     * @return {String}
     * The N-Triples representation of this RDFNode.
     *
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toNT-DOMString
     */
    toNT() {
        throw new Error("Calling an abstract method.");
    }
}
