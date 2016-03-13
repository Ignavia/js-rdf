import RDFNode from "./RDFNode.js";

/**
 * Represents an RDF blank node.
 * 
 * @see https://www.w3.org/TR/rdf-interfaces/#blank-nodes
 */
export default class BlankNode extends RDFNode {

    /**
     * @param {*} tempName
     * A temporary identifier for this node. It must be possible to stringify
     * it.
     */
    constructor(tempName) {
        super("BlankNode", tempName);
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
        return `_:${this.nominalValue}`;
    }

    /**
     * @override
     */
    toNT() {
        return `_:${this.nominalValue}`;
    }
}
