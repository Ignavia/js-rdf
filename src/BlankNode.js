import RDFNode from "./RDFNode.js";

/**
 * Represents an RDF blank node.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#blank-nodes
 */
export default class BlankNode extends RDFNode {

    /**
     * Creates a blank node from an N-Triples string.
     *
     * @param {String} ntString
     * The N-Triples string to parse.
     *
     * @return {BlankNode}
     * The created blank node.
     *
     * @throws
     * If the string cannot be parsed.
     */
    static fromNT(ntString) {
        const regex = /^_:(.*)$/;

        if (regex.test(ntString)) {
            const [, tempName] = regex.exec(ntString);
            return new BlankNode(tempName);
        } else {
            throw new Error(`Could not parse ${ntString}.`);
        }
    }

    /**
     * Checks if the given string is a serialized blank node in the N-Triples
     * format.
     *
     * @param {string} s
     * The string to check.
     *
     * @return {Boolean}
     * The result of the test.
     */
    static isNTBlankNode(s) {
        const regex = /^_:.*$/;
        return regex.test(s);
    }

    /**
     * @param {*} tempName
     * A temporary identifier for this node. It must be possible to stringify
     * it.
     */
    constructor(tempName) {
        super("BlankNode", tempName);
    }

    /**
     * The temporary name of this named node.
     */
    get tempName(){
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
        return `_:${this.nominalValue}`;
    }
}
