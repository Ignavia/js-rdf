import {EventManager, IDGenerator, GumpMap, observableExtendedMixin, tortilla} from "@ignavia/util";

import Literal from "./Literal.js";

/**
 * Provides IDs for graphs.
 *
 * @type {IDGenerator}
 * @ignore
 */
const idGenerator = new IDGenerator("g");

/**
 * Turns the given value into a primitive value using the [Symbol.toPrimitive]
 * method if it exists.
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
    } else if (typeof v[Symbol.toPrimitive] === "function") {
        return v[Symbol.toPrimitive]("number");
    } else if (typeof v.valueOf === "function") {
        return v.valueOf();
    } else if (typeof v.toString === "function") {
        return v.toString();
    }
    return v;
}

/**
 * Tests if the given value is a literal.
 *
 * @param {*} v
 * The value to test.
 *
 * @return {Boolean}
 * Whether it is a literal.
 *
 * @ignore
 */
function isLiteral(v) {
    return v instanceof Literal;
}

/**
 * An RDF graph.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#graphs
 */
export default class Graph {

    /**
     * @param {Array} [initialValues=[]]
     * An array with all triples to add initially.
     */
    constructor(initialValues = []) {

        /**
         * The ID of this graph.
         *
         * @type {String}
         */
        this.id = idGenerator.next();

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

        /**
         * Maps from IDs to nodes.
         *
         * @type {Map}
         * @private
         */
        this.nodes = new Map();

        /**
         * Maps from IDs to triples.
         *
         * @type {Map}
         * @private
         */
        this.triples = new Map();

        /**
         * Manages events and listeners.
         *
         * @type {EventManager}
         * @private
         */
        this.eventManager = new EventManager();

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

            this.addNodeToIdMap(triple.subject);
            this.addNodeToIdMap(triple.predicate);
            this.addNodeToIdMap(triple.object);
            this.triples.set(triple.id, triple);

            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "add",
                data:   triple
            }));
        }

        return this;
    }

    /**
     * Adds the given node to the ID-to-RDFNode-map.
     *
     * @param {RDFNode} node
     * The node to add.
     */
    addNodeToIdMap(node) {
        const count = (this.nodes.has(node.id) ?
            this.nodes.get(node.id).count + 1 :
            1
        );
        this.nodes.set(node.id, { count, node });
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
        return !this.iterEquivalentTriples(triple).isEmpty();
    }

    /**
     * Returns an iterable for all matching nodes in this graph.
     *
     * @param {RDFNode} node
     * The node to match.
     *
     * @return {TortillaWrapper}
     * An iterable for all matching nodes.
     */
    iterEquivalentNodes(node) {
        return tortilla(this.nodes.values())
            .map(   v => v.node)
            .filter(n => n.equals(node));
    }

    /**
     * Returns an iterable for all matching triples in this graph.
     *
     * @param {Triple} triple
     * The triple to match.
     *
     * @return {TortillaWrapper}
     * An iterable for all matching triples.
     */
    iterEquivalentTriples(triple) {
        const p = toPrimitive(triple.predicate);
        const o = toPrimitive(triple.object);
        const s = toPrimitive(triple.subject);

        return tortilla(this.pos.get([p, o, s])).filter(t => t.equals(triple));
    }

    /**
     * Looks up the RDFNode for an ID.
     *
     * @param {String} id
     * The ID of the node.
     *
     * @return {RDFNode}
     * The corresponding node or undefined if none is found.
     */
    getNodeById(id) {
        return (this.nodes.get(id) || {}).node;
    }

    /**
     * Looks up the triple for an ID.
     *
     * @param {String} id
     * The ID of the triple.
     *
     * @return {RDFNode}
     * The corresponding triple or undefined if none is found.
     */
    getTripleById(id) {
        return this.triples.get(id);
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
        const matching = this.iterEquivalentTriples(triple);

        if (!matching.isEmpty()) {
            for (let triple of matching) {
                const s = toPrimitive(triple.subject);
                const l = isLiteral(triple.object);
                const p = toPrimitive(triple.predicate);
                const o = toPrimitive(triple.object);

                this.slpo.delete([s, l, p, o], triple);
                this.pos.delete([p, o, s], triple);
                this.osp.delete([o, s, p], triple);

                this.removeNodeFromIdMap(triple.subject);
                this.removeNodeFromIdMap(triple.predicate);
                this.removeNodeFromIdMap(triple.object);
                this.triples.delete(triple.id);
            }

            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "remove",
                data:   triple
            }));
        }

        return this;
    }

    /**
     * Removes the given node from the ID-to-RDFNode-map.
     *
     * @param {RDFNode} node
     * The node to remove.
     */
    removeNodeFromIdMap(node) {
        const count = this.nodes.get(node.id).count - 1;
        if (count === 0) {
            this.nodes.delete(node.id);
        } else {
            this.nodes.set(node.id, { count, node });
        }
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
     *
     * @private
     */
    findMatches(conf) {
        return this.lookUpCandidates(conf).filter(triple => (
            (!conf.subject   || triple.subject.equals(conf.subject))     &&
            (!conf.predicate || triple.predicate.equals(conf.predicate)) &&
            (!conf.object    || triple.object.equals(conf.object))
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
     *
     * @private
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
            candidates = this.slpo.get(s).values();
        } else if (predicate) {
            candidates = this.pos.get(p).values();
        } else if (object) {
            candidates = this.osp.get(o).values();
        } else {
            candidates = this.slpo.values();
        }

        return tortilla(candidates);
    }

    /**
     * Yields all triples with the given subject and a literal object.
     *
     * @param {RDFNode} subject
     * The subject to get the triples for.
     */
    literals(subject) {
        const s = toPrimitive(subject);

        if (this.slpo.has([s, true])) {
            return tortilla(this.slpo.get([s, true]).values()).filter(
                triple => triple.subject.equals(subject)
            );
        } else {
            return tortilla([]);
        }
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
     * Removes all triples from this graph.
     */
    clear() {
        if (this.length > 0) {
            const deleted = [...this];

            this.slpo.clear();
            this.pos.clear();
            this.osp.clear();

            this.nodes.clear();
            this.triples.clear();

            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "clear",
                data:   deleted
            }));
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

    /**
     * Returns a string representation of this graph.
     *
     * @return {String}
     * A string representing this graph.
     */
    toString() {
        let result = "";
        for (let triple of this) {
            result += triple.toString() + " .\n";
        }
        return result;
    }
}

// Make graph observable
Object.assign(Graph.prototype, observableExtendedMixin);
