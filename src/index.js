export RDFEnvironment   from "./RDFEnvironment.js";
export Graph            from "./Graph.js";
export Triple           from "./Triple.js";
//export RDFNode          from "./RDFNode.js";
export BlankNode        from "./BlankNode.js";
export Literal          from "./Literal.js";
export NamedNode        from "./NamedNode.js";
export Profile          from "./Profile.js";
export PrefixMap        from "./PrefixMap.js";
export TermMap          from "./TermMap.js";
export {xmlSchemaTypes} from "./xmlSchemaTypes.js";
export TurtleReader     from "./TurtleReader.js";
export TurtleWriter     from "./TurtleWriter.js";


// TODO: remove this once circular dependenciesare resolved correctly.

import RDFNode          from "./RDFNode.js";
import BlankNode        from "./BlankNode.js";
import Literal          from "./Literal.js";
import NamedNode        from "./NamedNode.js";

/**
 * Creates an appropriate RDFNode for an N-Triples string.
 *
 * @param {String} ntString
 * The N-Triples string to parse.
 *
 * @return {RDFNode}
 * The created RDFNode.
 *
 * @throws
 * If the string cannot be parsed.
 */
RDFNode.fromNT = function (ntString) {
    if (BlankNode.isNTBlankNode(ntString)) {
        return BlankNode.fromNT(ntString);
    } else if (Literal.isNTLiteral(ntString)) {
        return Literal.fromNT(ntString);
    } else if (NamedNode.isNTNamedNode(ntString)) {
        return NamedNode.fromNT(ntString);
    } else {
        throw new Error(`Could not parse ${ntString}.`);
    }
};

export {RDFNode};
