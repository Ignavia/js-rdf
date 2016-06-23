import RDFNode from "./RDFNode.js";

/**
 * Represents an RDF named node.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#named-nodes
 */
export default class NamedNode extends RDFNode {

    /**
     * Creates a named node from an N-Triples string.
     *
     * @param {String} ntString
     * The N-Triples string to parse.
     *
     * @return {NamedNode}
     * The created named node.
     *
     * @throws
     * If the string cannot be parsed.
     */
    static fromNT(ntString) {
        const regex = /^<(.*)>$/;

        if (regex.test(ntString)) {
            const [, iri] = regex.exec(ntString);
            return new NamedNode(iri);
        } else {
            throw new Error(`Could not parse ${ntString}.`);
        }
    }

    /**
     * Checks if the given string is a serialized named node in the N-Triples
     * format.
     *
     * @param {string} s
     * The string to check.
     *
     * @return {Boolean}
     * The result of the test.
     */
    static isNTNamedNode(s) {
        const regex = /^<.*>$/;
        return regex.test(s);
    }

    /**
     * @param {String} iri
     * The IRI identifier of this node.
     */
    constructor(iri) {
        super("NamedNode", iri);
    }

    /**
     * The IRI of this named node.
     */
    get iri() {
        return this.nominalValue;
    }

    /**
     * @override
     */
    equals(toCompare) {
        if (toCompare instanceof RDFNode) {
            return this.interfaceName === toCompare.interfaceName &&
                   this.nominalValue  === toCompare.nominalValue;
        }
        return this.valueOf() === toCompare;
    }

    /**
     * @override
     */
    valueOf() {
        return `${this.nominalValue}`;
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
        return `<${this.nominalValue}>`;
    }
}
