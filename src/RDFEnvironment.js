import {IDGenerator} from "@ignavia/util";

import Graph     from "./Graph.js";
import Triple    from "./Triple.js";
import BlankNode from "./BlankNode.js";
import Literal   from "./Literal.js";
import NamedNode from "./NamedNode.js";
import Profile   from "./Profile.js";
import PrefixMap from "./PrefixMap.js";
import TermMap   from "./TermMap.js";

/**
 * Contains the most important prefixes.
 *
 * @type {PrefixMap}
 * @ignore
 */
const defaultPrefixes = new PrefixMap([
    ["owl",  "http://www.w3.org/2002/07/owl#"],
    ["rdf",  "http://www.w3.org/1999/02/22-rdf-syntax-ns#"],
    ["rdfs", "http://www.w3.org/2000/01/rdf-schema#"],
    ["rdfa", "http://www.w3.org/ns/rdfa#"],
    ["xhv",  "http://www.w3.org/1999/xhtml/vocab#"],
    ["xml",  "http://www.w3.org/XML/1998/namespace#"],
    ["xsd",  "http://www.w3.org/2001/XMLSchema#"]
]);

const idGenerator = new IDGenerator("hfld#");

/**
 * A high level API for working with RDF.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#rdf-environment
 */
export default class RDFEnvironment extends Profile {

    /**
     * @param {Object} conf
     * The configuration object.
     *
     * @param {PrefixMap} [conf.prefixes]
     * The prefix map to use.
     *
     * @param {TermMap} {conf.terms}
     * The term map to use.
     */
    constructor(conf = {}) {
        super(conf);
        this.prefixes.addAll(defaultPrefixes);
    }

    /**
     * Creates a new Graph.
     *
     * @param {Array} [triples=[]]
     * The triples to add to the graph initially.
     *
     * @return
     * The created graph.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createGraph-Graph---Triple-triples
     */
    createGraph(triples = []) {
        return new Graph(triples);
    }

    /**
     * Creates a new triple.
     *
     * @param {RDFNode} subject
     * The subject of the triple.
     *
     * @param {RDFNode} predicate
     * The predicate of the triple.
     *
     * @param {RDFNode} object
     * The object of the triple.
     *
     * @return {Triple}
     * The created triple.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTriple-Triple-RDFNode-subject-RDFNode-predicate-RDFNode-object
     */
    createTriple(subject, predicate, object) {
        return new Triple(subject, predicate, object);
    }

    /**
     * Creates a new BlankNode.
     *
     * @return {BlankNode}
     * The created blank node.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createBlankNode-BlankNode
     */
    createBlankNode() {
        return new BlankNode(idGenerator.next());
    }

    /**
     * Creates a new literal.
     *
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
     *
     * @return {Literal}
     * The created literal.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createLiteral-Literal-DOMString-value-DOMString-language-NamedNode-datatype
     */
    createLiteral(value, {language, datatype} = {}) {
        return new Literal(value, {language, datatype});
    }

    /**
     * Creates a new named node.
     *
     * @param {String} value
     * The IRI identifier of this node or a corresponding CURIE or term.
     *
     * @return {NamedNode}
     * The created named node.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createNamedNode-NamedNode-DOMString-value
     */
    createNamedNode(value) {
        const iri = this.resolve(value) || value;
        return new NamedNode(iri);
    }

    /**
     * Creates a function from a given filter and a callback. The filter gets a
     * triple and if it returns true, the callback is called with that triple.
     *
     * @param {Function} test
     * The filter.
     *
     * @param {Function} action
     * The callback.
     *
     * @return {Function}
     * The combined function.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createAction-TripleAction-TripleFilter-test-TripleCallback-action
     */
    createAction(test, action) {
        return function (triple) {
            if (test(triple)) {
                action(triple);
            }
        };
    }

    /**
     * Creates a new Profile.
     *
     * @param {Boolean} [empty=false]
     * Whether the Profile should be empty or if it should include all entries
     * of this environment.
     *
     * @return {Profile}
     * The created profile.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createProfile-Profile-boolean-empty
     */
    createProfile(empty = false) {
        return empty ? new Profile() : this.clone();
    }

    /**
     * Creates a new TermMap.
     *
     * @param {Boolean} [empty=false]
     * Whether the TermMap should be empty or if it should include all entries
     * of this environment.
     *
     * @return {TermMap}
     * The created TermMap.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTermMap-TermMap-boolean-empty
     */
    createTermMap(empty = false) {
        return empty ?  new TermMap() : this.terms.clone();
    }

    /**
     * Creates a new PrefixMap.
     *
     * @param {Boolean} [empty=false]
     * Whether the PrefixMap should be empty or if it should include all entries
     * of this environment.
     *
     * @return {PrefixMap}
     * The created PrefixMap.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createPrefixMap-PrefixMap-boolean-empty
     */
    createPrefixMap(empty = false) {
        return empty ? new PrefixMap() : this.prefixes.clone();
    }
}
