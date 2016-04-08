import {IDGenerator} from "@ignavia/util";

/**
 * Provides IDs for triple.
 *
 * @type {IDGenerator}
 * @ignore
 */
const idGenerator = new IDGenerator("t");

/**
 * Represents an RDF triple.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#triples
 */
export default class Triple {

    /**
     * @param {RDFNode} subject
     * The subject associated with the triple.
     *
     * @param {RDFNode} predicate
     * The predicate associated with the triple.
     *
     * @param {RDFNode} object
     * The object associated with the triple.
     */
    constructor(subject, predicate, object) {

        /**
         * The subject associated with the triple.
         *
         * @type {RDFNode}
         */
        this.subject = subject;

         /**
         * The predicate associated with the triple.
         *
         * @type {RDFNode}
         */
        this.predicate = predicate;

         /**
         * The object associated with the triple.
         *
         * @type {RDFNode}
         */
        this.object = object;

        /**
         * The ID of this triple.
         *
         * @type {String}
         */
        this.id = idGenerator.next();
    }

    /**
     * Tests if another triple is equivalent to this one.
     *
     * @param {Triple} otherTriple
     * The other triple.
     *
     * @return {Boolean}
     * If the other triple is equivalent to this one.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Triple-equals-boolean-Triple-otherTriple
     */
    equals(otherTriple) {
        return otherTriple instanceof Triple                  &&
               (this.subject).equals(otherTriple.subject)     &&
               (this.predicate).equals(otherTriple.predicate) &&
               (this.object).equals(otherTriple.object);
    }

    /**
     * Converts this triple into a string in N-Triples notation.
     *
     * @return {String}
     * This triple in N-Triples notation.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Triple-toString-stringifier-DOMString
     */
    toString() {
        return `${this.subject.toNT()} ${this.predicate.toNT()} ${this.object.toNT()}`;
    }
}
