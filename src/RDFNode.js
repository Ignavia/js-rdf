/**
 * Defines an interface for RDFNodes.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#nodes
 */
export default class RDFNode {

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
