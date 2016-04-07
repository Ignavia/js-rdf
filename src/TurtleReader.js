import n3 from "n3";
const n3Util = n3.Util;

import Graph     from "./Graph.js";
import Triple    from "./Triple.js";
import BlankNode from "./BlankNode.js";
import Literal   from "./Literal.js";
import NamedNode from "./NamedNode.js";
import Profile   from "./Profile.js";


/**
 * Transforms a Turtle string into a graph and a profile.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#data-parsers
 */
export default class TurtleReader {

    /**
     *
     */
    constructor() {

        /**
         * The N3.js parser.
         *
         * @type {*}
         * @private
         */
        this.parser = n3.Parser();
    }

    /**
     * Transforms an N3 word (subject, predicate, object as a string) into the
     * corresponding RDFNode.
     *
     * @param {String} n3Word
     * The word to transform.
     *
     * @param {Object} options
     * The options object.
     *
     * @param {Boolean} [options.allowBlank=true]
     * Whether blank nodes are allowed.
     *
     * @param {Boolean} [options.allowNamed=true]
     * Whether named nodes are allowed.
     *
     * @param {Boolean} [options.allowLiteral=true]
     * Whether literals are allowed.
     *
     * @return {RDFNode}
     * The respective RDFNode.
     *
     * @throws {Error}
     * If the word is invalid.
     */
    parseN3Word(n3Word, {allowBlank = true, allowNamed = true, allowLiteral = true} = {}) {
        if (allowBlank && n3Util.isBlank(n3Word)) {
            n3Word = n3Word.replace(/^_:b[0-9]+_/, "");
            return new BlankNode(n3Word);
        } else if (allowNamed && n3Util.isIRI(n3Word)) {
            return new NamedNode(n3Word);
        } else if (allowLiteral && n3Util.isLiteral(n3Word)) {
            const value    = n3Util.getLiteralValue(n3Word);
            const language = n3Util.getLiteralLanguage(n3Word) || undefined;
            const datatype = n3Util.getLiteralType(n3Word)     || undefined;
            return new Literal(value, {language, datatype});
        } else {
            throw new Error(`Could not parse ${n3Word}.`);
        }
    }

    /**
     * Transform an N3 triple object into our implementation.
     *
     * @param {*} n3Triple
     * A triple made by the N3 parser.
     *
     * @return {Triple}
     * The corresponding triple.
     *
     * @private
     */
    parseN3Triple(n3Triple) {
        const subject   = this.parseN3Word(n3Triple.subject,   {allowLiteral: false});
        const predicate = this.parseN3Word(n3Triple.predicate, {allowBlank: false, allowLiteral: false});
        const object    = this.parseN3Word(n3Triple.object);
        return new Triple(subject, predicate, object);
    }

    /**
     * Parses a Turtle string an returns a graph and a profile.
     *
     * @param {String} s
     * The Turtle string to parse.
     *
     * @param {Object} options
     * The options object.
     *
     * @param {Function} [options.filter]
     * Determines which triple to include in the resulting graph.
     *
     * @param {Graph} [options.graph]
     * The graph to add the triples to.
     *
     * @param {Profile} [options.profile]
     * The profile to add the prefixes and terms to.
     *
     * @return {Promise}
     * A promise that eventually resolves to the resulting graph or profile. If
     * there is an error, the promise is rejected.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-DataParser-parse-boolean-any-toparse-ParserCallback-callback-DOMString-base-TripleFilter-filter-Graph-graph
     */
    parse(s, { filter = ()=>true, graph = new Graph(), profile = new Profile() } = {}) {
        return new Promise((resolve, reject) => this.parser.parse(
            s,
            (err, n3Triple, prefixes) => {
                if (err) {
                    reject(err);
                }
                if (n3Triple) {
                    const triple = this.parseN3Triple(n3Triple);
                    if (filter(triple)) {
                        graph.add(triple);
                    }
                }
                if (prefixes) {
                    resolve({graph, profile});
                }
            },
            (prefix, iri) => {
                profile.setPrefix(prefix, iri);
            }
        ));
    }
}