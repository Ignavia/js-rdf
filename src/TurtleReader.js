import n3Parser from "./n3/n3Parser.js";

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
        this.parser = n3Parser();
    }

    /**
     * Checks if the given string represents an IRI.
     *
     * @param {String} entityString
     * The entity to test.
     *
     * @return {Boolean}
     * Whether the string represents an IRI.
     */
    isIRI(entityString) {
        return !this.isLiteral(entityString) && !this.isBlank(entityString);
    }

    /**
     * Checks if the given string represents a literal.
     *
     * @param {String} entityString
     * The entity to test.
     *
     * @return {Boolean}
     * Whether the string represents a literal.
     */
    isLiteral(entityString) {
        return entityString.startsWith(`"`);
    }

    /**
     * Checks if the given string represents a blank node.
     *
     * @param {String} entityString
     * The entity to test.
     *
     * @return {Boolean}
     * Whether the string represents a blank node.
     */
    isBlank(entityString) {
        return entityString.startsWith("_:");
    };

    /**
     * Returns the value of the literal.
     *
     * @param {String} literalString
     * The literal to parse.
     *
     * @return {String}
     * The value of the literal.
     *
     * @throws {Error}
     * If the provided string does not represent a literal.
     *
     * @private
     */
    getLiteralValue(literalString) {
        const regex = /^"([^]*)"/;

        if (!regex.test(literalString)) {
            throw new Error(`${literalString} is not a literal.`);
        }

        const [, value] = regex.exec(literalString);
        return value;
    }

    /**
     * Returns the datatype of the literal.
     *
     * @param {String} literalString
     * The literal to parse.
     *
     * @return {String}
     * The datatype of the literal.
     *
     * @throws {Error}
     * If the provided string does not represent a literal.
     *
     * @private
     */
    getLiteralType(literalString) {
        const regex = /^"[^]*"(?:\^\^([^"]+)|(@)[^@"]+)?$/;

        if (!regex.test(literalString)) {
            throw new Error(`${literalString} is not a literal.`);
        }

        const [, type, language] = regex.exec(literalString);
        if (type) {
            return type;
        } else if (language) {
            return "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
        } else {
            return "http://www.w3.org/2001/XMLSchema#string";
        }
    }

    /**
     * Returns the language of the literal.
     *
     * @param {String} literalString
     * The literal to parse.
     *
     * @return {String}
     * The language of the literal.
     *
     * @throws {Error}
     * If the provided string does not represent a literal.
     *
     * @private
     */
    getLiteralLanguage(literalString) {
        const regex = /^"[^]*"(?:@([^@"]+)|\^\^[^"]+)?$/;

        if (!regex.test(literalString)) {
            throw new Error(`${literalString} is not a literal.`);
        }

        const [, language] = regex.exec(literalString);
        if (language) {
            return language.toLowerCase();
        } else {
            return undefined;
        }
    };

    /**
     * Transforms an N3 entity (subject, predicate, object as a string) into the
     * corresponding RDFNode.
     *
     * @param {String} entityString
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
    parseN3Entity(entityString, {allowBlank = true, allowNamed = true, allowLiteral = true} = {}) {
        if (allowBlank && this.isBlank(entityString)) {
            entityString = entityString.replace(/^_:b[0-9]+_/, "");
            return new BlankNode(entityString);
        } else if (allowNamed && this.isIRI(entityString)) {
            return new NamedNode(entityString);
        } else if (allowLiteral && this.isLiteral(entityString)) {
            const value    = this.getLiteralValue(entityString);
            const language = this.getLiteralLanguage(entityString);
            const datatype = this.getLiteralType(entityString);
            return new Literal(value, {language, datatype});
        } else {
            throw new Error(`Could not parse ${entityString}.`);
        }
    }

    /**
     * Transforms the given subject string into an RDFNode.
     *
     * @param {String} subjectString
     * The string representing the subject.
     *
     * @return {RDFNode}
     * The created RDFNode.
     *
     * @throw {Error}
     * If the subject string is invalid. Only named and blank nodes are allowed
     * as subject.
     *
     * @private
     */
    parseSubject(subjectString) {
        try {
            return this.parseN3Entity(subjectString, {allowLiteral: false});
        } catch (err) {
            throw new Error(`${subjectString} is not a valid subject.`);
        }
    }

    /**
     * Transforms the given predicate string into an RDFNode.
     *
     * @param {String} predicateString
     * The string representing the predicate.
     *
     * @return {RDFNode}
     * The created RDFNode.
     *
     * @throws {Error}
     * If the predicate string is invalid. Only named nodes are allowed as
     * predicate.
     *
     * @private
     */
    parsePredicate(predicateString) {
        try {
            return this.parseN3Entity(predicateString, {allowBlank: false, allowLiteral: false});
        } catch (err) {
            throw new Error(`${predicateString} is not a valid predicate.`);
        }
    }

    /**
     * Transforms the given object string into an RDFNode.
     *
     * @param {String} objectString
     * The string representing the object.
     *
     * @return {RDFNode}
     * The created RDFNode.
     *
     * @throws {Error}
     * If the object string is invalid.
     *
     * @private
     */
    parseObject(objectString) {
        try {
            return this.parseN3Entity(objectString);
        } catch (err) {
            throw new Error(`${objectString} is not a valid object.`);
        }
    }

    /**
     * Transform an N3 triple object into a triple object of our
     * implementation.
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
        const subject   = this.parseSubject(n3Triple.subject);
        const predicate = this.parsePredicate(n3Triple.predicate);
        const object    = this.parseObject(n3Triple.object);
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
     * A promise that eventually resolves to the resulting graph and profile.
     * If there is an error, the promise is rejected.
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