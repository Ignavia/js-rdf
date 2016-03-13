import {Tolkien1To1Map} from "@ignavia/util";

/**
 * Maps from terms to IRIs and back.
 * 
 * @see https://www.w3.org/TR/rdf-interfaces/#term-maps
 */
export default class TermMap {
    
    /**
     * @param {Array} initialValue
     * An array with [term, iri] entries.
     */
    constructor(initialValues) {
        
        /**
         * Maps from terms to IRIs and back.
         * 
         * @type {Tolkien1To1Map}
         * @private
         */
        this.termToIRI = new Tolkien1To1Map();
        
        /**
         * The default IRI to use if a term cannot be resolved.
         * 
         * @type {String}
         * @private
         */
        this.default = undefined; 
        
        // Add initial values
        for (let [term, iri] of initialValues) {
            this.set(term, iri);
        }
    }

    /**
     * Connects the given term and IRI.
     * 
     * @param {String} term
     * The term to use. It must not contain any whitespace or the : (single-colon)
     * character.
     * 
     * @param {String} iri
     * The IRI to use.
     * 
     * @return {TermMap}
     * The TermMap to make the object chainable.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-set-omittable-setter-void-DOMString-term-DOMString-iri
     */
    set(term, iri) {
        this.termToIRI.add(term, iri);
        return this;
    }

    /**
     * Tests if an entry for the given term exists.
     * 
     * @param {String} term
     * The term to test.
     * 
     * @return {Boolean}
     * Whether an entry for the given term exists.
     */    
    hasTerm(term) {
        return this.termToIRI.hasX(term);
    }
    
    /**
     * Tests if an entry for the given IRI exists.
     * 
     * @param {String} iri
     * The IRI to test.
     * 
     * @return {Boolean}
     * Whether an entry for the given IRI exists.
     */
    hasIRI(iri) {
        return this.termToIRI.hasY(iri);
    }

    /**
     * Removes the entry for the given term from this TermMap.
     * 
     * @param {String} term
     * The term to remove.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-remove-omittable-deleter-void-DOMString-term
     */
    remove(term) {
        this.termToIRI.deleteX(term);
    }

    /**
     * Given a valid term for which an IRI is known, this method will return
     * the resulting IRI. If no term is known and a default has been set, the
     * IRI is obtained by concatenating the term and the default iri. Otherwise
     * null is returned.
     * 
     * @param {String} term
     * The term to resolve.
     * 
     * @return {String}
     * The corresponding IRI.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term
     */
    resolve(term) {
        if (this.termToIRI.hasX(term)) {
            return this.termToIRI.convertXToY(term);
        } else if (this.default) {
            return this.default + term;
        } else {
            return null;
        }
    }

    /**
     * Given an IRI for which an term is known this method returns a term. If
     * no term is known the original IRI is returned.
     * 
     * @param {String} iri
     * The IRI to shrink.
     * 
     * @return {String}
     * The corresponding term.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri
     */
    shrink(iri) {
        if (this.termToIRI.hasY(iri)) {
            return this.termToIRI.convertYToX(iri);    
        } else {
            return iri;
        }
    }

    /**
     * Sets the default IRI to be used when an term cannot be resolved.
     * 
     * @param {String} iri
     * The default IRI.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-setDefault-void-DOMString-iri
     */
    setDefault(iri) {
        this.default = iri;
    }
    
    /**
     * Imports all entries from the given TermMap.
     * 
     * @param {TermMap} terms
     * The TermMap to import.
     * 
     * @param {Boolean} [override=false]
     * Whether conflicting entries in this map should be overriden by the ones
     * in the given map.
     * 
     * @return {TermMap}
     * This TermMap to make the method chainable.
     * 
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override
     */
    addAll(terms, override = false) {
        for (let [term, iri] of terms) {
            if (override || !this.termToIRI.hasEither(term, iri)) {
                this.set(term, iri);
            }
        }
        return this;
    }
 
    /**
     * Yields all terms in this map. 
     */   
    * terms() {
        yield* this.termToIRI.xs();
    }
    
    /**
     * Yields all IRIs in this map.
     */
    * iris() {
        yield* this.termToIRI.ys();
    }
    
    /**
     * Yields all term-IRI-entries in this map.
     */
    * entries() {
        yield* this.termToIRI.entries();
    }
   
    /**
     * Yields all term-IRI-entries in this map. 
     */ 
    [Symbol.iterator]() {
        return this.entries();
    }
    
    /**
     * Returns a copy of this TermMap.
     * 
     * @return {TermMap}
     * A copy of this TermMap.
     */
    clone() {
        return new TermMap(this);
    }
}
