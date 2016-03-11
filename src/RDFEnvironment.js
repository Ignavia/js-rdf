    // BlankNode    createBlankNode ();
    // NamedNode    createNamedNode (DOMString value);
    // Literal      createLiteral (DOMString value, optional DOMString? language, optional NamedNode? datatype);
    // Triple       createTriple (RDFNode subject, RDFNode predicate, RDFNode object);
    // Graph        createGraph (optional []Triple triples);
    // TripleAction createAction (TripleFilter test, TripleCallback action);
    // Profile      createProfile (optional boolean empty);
    // TermMap      createTermMap (optional boolean empty);
    // PrefixMap    createPrefixMap (optional boolean empty);

import Graph from "./Graph.js";
import Triple from "./Triple.js";
import BlankNode from "./BlankNode.js";
import Literal from "./Literal.js";
import NamedNode from "./NamedNode.js";

import Profile from "./Profile.js";

export default class RDFEnvironment extends Profile {
    constructor() {
        super();
    }

    createGraph(triples) {
        const g = new Graph();
        g.addAll(triples);
    }

    createTriple(subject, predicate, object) {
        return new Triple(subject, predicate, object);
    }

    createBlankNode() {
        return new BlankNode();
    }

    createLiteral(value, {language, datatype} = {}) {

    }

    createNamedNode(value) {
        return new NamedNode(value);
    }



    createAction(test, action) {
        return function(triple) {
            if (test(triple)) {
                action(triple);
            }
        }
    }

    createProfile(empty = false) {
        // If empty, return new profile; otherwise clone the current one
    }

    createTermMap(empty = false) {
        // If empty, return new termmap; otherwise clone the current one
    }

    createPrefixMap(empty = false) {
        // If empty, return new prefixmap; otherwise clone the current one
    }
}