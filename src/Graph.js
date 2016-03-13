import {GumpMap} from "@ignavia/util";

/**
 * An RDF graph.
 * 
 * @see https://www.w3.org/TR/rdf-interfaces/#graphs
 */
export default class Graph {
    
    /**
     * @param {Array} initialValues
     * An array with all triples to add initially.
     */
    constructor(initialValues) {

        this.spo = new GumpMap();
        this.pos = new GumpMap();
        this.osp = new GumpMap();

        // send events blank nodes and named nodes catch them and add literals to their itnernal indexes
        // list of literals, named nodes and blank nodes??
        
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
        return this.spo.size;
    }

    add(triple) {
        const s = triple.subject.valueOf(), p = triple.predicate, o = triple.object;

        this.addToIndex(this.spo, s, p, o, triple);
        this.addToIndex(this.pos, p, o, s, triple);
        this.addToIndex(this.osp, o, s, p, triple);
        // if a subject / predicate / object exists alreaddy, you need to take this one
        this.length++; // TODO check if duplicate (before the 6 add calls; return)

        return this;
    }

    addToIndex(index, x, y, z, triple) {
        const stage1 = index;
        if (!stage1.has(x)) {
            stage1.set(x, new Map());
        }

        const stage2 = stage1.get(x);
        if (!stage2.has(y)) {
            stage2.set(y, new Map());
        }

        const stage3 = stage2.get(y);
        if (!stage3.has(z)) {
            stage3.set(z, triple);
        }
    }

    addAll(graph) {
        for (let triple of graph) {
            this.add(triple);
        }
        return this;
    }

    remove(triple) {
        const s = triple.subject, p = triple.predicate, o = triple.object;

        this.removeFromIndex(this.spo, s, p, o); // store
        this.removeFromIndex(this.pos, p, o, s);
        this.removeFromIndex(this.osp, o, s, p);

        this.length--; // TODO check if it exists (do it before the 6 remove calls and return)

        return this;
    }

    removeFromIndex(index, x, y, z) {
        const stage1 = index,
              stage2 = stage1.get(x),
              stage3 = stage2.get(y);

        stage3.delete(z);

        if (stage3.size() === 0) {
            stage2.delete(y);
        }

        if (stage2.size() === 0) {
            stage1.delete(x);
        }
    }

// Have some Utility class for traversing (iterating) maps/sets in maps; potentially with a limit

    merge(graph) {
        const result = new Graph();
        result.addAll(...this);
        result.addAll(...graph);
        return result;
    }

    match({subject, predicate, object} = {}, limit) {
        const s = subject, p = predicate, o = object;

        //if subject is an RDFNode, use value of on it

    }

    some(f) {
        for (let triple of this) {
            if (f(triple)) {
                return true;
            }
        }
        return false;
    }

    every(f) {
        for (let triple of this) {
            if (!f(triple)) {
                return false;
            }
        }
        return true;
    }

    filter(f) {
        const result = new Graph();
        for (let triple of this) {
            if (f(triple)) {
                result.add(triple);
            }
        }
    }

    forEach(f) {
        for (let triple of this) {
            f(this);
        }
    }

    removeMatches({subject, predicate, object} = {}) {
        // Find matches and remove them
    }

    * [Symbol.iterator]() {
        const stage1 = this.spo;
        for (let s of stage1.keys()) {
            const stage2 = stage1.get(s);
            for (let p of stage2.keys()) {
                const stage3 = stage2.get(p);
                for (let o of stage3.keys()) {
                    yield stage3.get(o);
                }
            }
        }
    }

    toArray() {
        return [...this];
    }
}
