import RDFNode from "./RDFNode.js";

/**
 * Represents an RDF named node.
 */
export default class NamedNode extends RDFNode {

    /**
     * @param {String} iri
     * The IRI identifier of this node.
     */
    constructor(iri) {
        super("NamedNode", iri);
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
