import {GumpMap, tortilla} from "@ignavia/util";

import Literal from "./Literal.js";

/**
 * Turns the given value into a primitive value using the [Symbol.iterator]
 * method.
 *
 * @param {*} v
 * The value to convert.
 *
 * @return {*}
 * The resulting primitive.
 *
 * @ignore
 */
function toPrimitive(v) {
    if (v === undefined || v === null) {
        return v;
    }
    return v[Symbol.toPrimitive]();
}

function isLiteral(v) {
    return v instanceof Literal;
}

/**
 * An RDF graph.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#graphs
 */
export default class Graph {

    // TODO listeners

    /**
     * @param {Array} initialValues
     * An array with all triples to add initially.
     */
    constructor(initialValues) {

        /**
         * Maps from subjects to isLiteral to predicates to objects to triples.
         *
         * @type {GumpMap}
         * @private
         */
        this.slpo = new GumpMap();

        /**
         * Maps from predicates to objects to subjects to triples.
         *
         * @type {GumpMap}
         * @private
         */
        this.pos = new GumpMap();

        /**
         * Maps from objects to subjects to predicates to triples.
         *
         * @type {GumpMap}
         * @private
         */
        this.osp = new GumpMap();

        // Add initial values
        for (let triple of initialValues) {
            this.add(triple);
        }
    }

    /**
     * The number of triples in this graph.
     *
     * @type {Number}
     */
    get length() {
        return this.slpo.size;
    }

    /**
     * Adds the given triple to this graph.
     *
     * @param {Triple} triple
     * The triple to add.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple
     */
    add(triple) {
        if (!this.has(triple)) {
            const s = toPrimitive(triple.subject);
            const l = isLiteral(triple.object);
            const p = toPrimitive(triple.predicate);
            const o = toPrimitive(triple.object);

            this.slpo.add([s, l, p, o], triple);
            this.pos.add([p, o, s], triple);
            this.osp.add([o, s, p], triple);
        }

        return this;
    }

    /**
     * Imports the given graph in to this graph.
     *
     * @param {Graph} graph
     * The graph to import.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAll-Graph-Graph-graph
     */
    addAll(graph) {
        for (let triple of graph) {
            this.add(triple);
        }
        return this;
    }

    /**
     * Tests if the given triple or an equivalent one exists in this graph.
     *
     * @param {Triple} triple
     * The triple to test.
     *
     * @return {Boolean}
     * Whether the triple exists already.
     */
    has(triple) {
        const p = toPrimitive(triple.predicate);
        const o = toPrimitive(triple.object);
        const s = toPrimitive(triple.subject);

        return !tortilla(this.pos.get([p, o, s]))
            .filter(t => t.equals(triple))
            .isEmpty();
    }

    /**
     * Removes the given triple from this graph.
     *
     * @param {Triple} triple
     * The triple to remove.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-remove-Graph-Triple-triple
     */
    remove(triple) {
        const s = toPrimitive(triple.subject);
        const l = isLiteral(triple.object);
        const p = toPrimitive(triple.predicate);
        const o = toPrimitive(triple.object);

        this.slpo.delete([s, l, p, o], triple);
        this.pos.delete([p, o, s],     triple);
        this.osp.delete([o, s, p],     triple);

        return this;
    }

    /**
     * This method removes all those triples in this graph which match the given
     * arguments.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.subject]
     * The subject to match against.
     *
     * @param {*} [conf.predicate]
     * The predicate to match against.
     *
     * @param {*} [conf.object]
     * The object to match against.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
     */
    removeMatches(conf) {
        let matches = this.findMatches(conf);
        for (let triple of matches) {
            this.remove(triple);
        }
        return this;
    }

    /**
     * Creates a new Graph which is a concatenation of this graph and the
     * given one.
     *
     * @param {Graph} graph
     * The other graph.
     *
     * @return {Graph}
     * The resulting graph.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-merge-Graph-Graph-graph
     */
    merge(graph) {
        return new Graph().addAll(this).addAll(graph);
    }

    /**
     * This method returns a new Graph which is comprised of all those triples
     * in this graph which match the given arguments.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.subject]
     * The subject to match against.
     *
     * @param {*} [conf.predicate]
     * The predicate to match against.
     *
     * @param {*} [conf.object]
     * The object to match against.
     *
     * @param {Number} [limit=0]
     * How many matches should be returned. If it is set to 0 all matches are
     * includes.
     *
     * @return {Graph}
     * The resulting graph.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
     */
    match(conf, limit = 0) {
        let matches = this.findMatches(conf);
        if (limit !== 0) {
            matches = matches.take(limit);
        }
        return new Graph(matches);
    }

    /**
     * Returns an Iterable for all matching triples.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.subject]
     * The subject to match against.
     *
     * @param {*} [conf.predicate]
     * The predicate to match against.
     *
     * @param {*} [conf.object]
     * The object to match against.
     *
     * @return {Iterable}
     * An Iterable for all matching triples.
     */
    findMatches(conf) {
        return this.lookUpCandidates(conf).filter(triple => (
            (!subject   || triple.subject.equals(subject))     &&
            (!predicate || triple.predicate.equals(predicate)) &&
            (!object    || triple.object.equals(object))
        ));
    }

    /**
     * Creates an Iterable for possibly matching triples.
     *
     * @param {Object} conf
     * The configuration object.
     *
     * @param {*} [conf.subject]
     * The subject to match against.
     *
     * @param {*} [conf.predicate]
     * The predicate to match against.
     *
     * @param {*} [conf.object]
     * The object to match against.
     *
     * @return {Iterable}
     * The resulting Iterable.
     */
    lookUpCandidates({subject, predicate, object} = {}) {
        const s = toPrimitive(subject);
        const p = toPrimitive(predicate);
        const o = toPrimitive(object);

        let candidates;
        if (subject && predicate && object) {
            candidates = tortilla.concat([
                this.slpo.get([s, false, p, o]).values(),
                this.slpo.get([s, true,  p, o]).values()
            ]);
        } else if (subject && predicate) {
            candidates = tortilla.concat([
                this.slpo.get([s, false, p]).values(),
                this.slpo.get([s, true,  p]).values()
            ]);
        } else if (predicate && object) {
            candidates = this.pos.get([p, o]).values();
        } else if (object && subject) {
            candidates = this.osp.get([o, s]).values();
        } else if (subject) {
            candidates = this.spo.get(s).values();
        } else if (predicate) {
            candidates = this.pos.get(p).values();
        } else if (object) {
            candidates = this.osp.get(o).values();
        } else {
            candidates = this.spo.values();
        }

        return tortilla(candidates);
    }

    literals(subject) {
        const s = toPrimitive(subject);

        return tortilla(this.slpo.get(s, true)).filter(
            triple => triple.subject.equals(subject)
        );
    }

    /**
     * Tests whether some triple in the graph passes the test.
     *
     * @param {Function} f
     * The test funtion.
     *
     * @return {Boolean}
     * If at least one triple passes the test.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback
     */
    some(f) {
        for (let triple of this) {
            if (f(triple)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests whether all triple in the graph passes the test.
     *
     * @param {Function} f
     * The test funtion.
     *
     * @return {Boolean}
     * If all triples pass the test.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-every-boolean-TripleFilter-callback
     */
    every(f) {
        for (let triple of this) {
            if (!f(triple)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Creates a new graph with all the triples which pass the test.
     *
     * @param {Function} f
     * The filter function.
     *
     * @return {Graph}
     * The resulting graph.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-filter-Graph-TripleFilter-filter
     */
    filter(f) {
        const result = new Graph();
        for (let triple of this) {
            if (f(triple)) {
                result.add(triple);
            }
        }
        return result;
    }

    /**
     * Calls the given function on each triple in this graph. It gets the triple
     * as its first argument and this graph as the second.
     *
     * @param {Function} f
     * The callback function.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-forEach-void-TripleCallback-callback
     */
    forEach(f) {
        for (let triple of this) {
            f(triple, this);
        }
    }

    /**
     * Yields the triples in this graph. Their order is arbitrary.
     */
    [Symbol.iterator]() {
        return this.slpo.values();
    }

    /**
     * Returns an array of the triples within this graph. Their order is
     * arbitrary.
     *
     * @return {Triple[]}
     * An array of the triples.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Graph-toArray-sequence-Triple
     */
    toArray() {
        return [...this];
    }
}
