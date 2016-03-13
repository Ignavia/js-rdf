import {Tolkien1To1Map} from "@ignavia/util";

/**
 * Maps from prefixes to IRIs and back.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#prefix-maps
 */
export default class PrefixMap {

    /**
     * @param {Array} initialValue
     * An array with [term, iri] entries.
     */
    constructor(initialValues) {

        /**
         * Maps from prefixes to IRIs and back.
         *
         * @type {Tolkien1To1Map}
         * @private
         */
        this.prefixToPath = new Tolkien1To1Map();

        // Add initial values
        for (let [prefix, path] of initialValues) {
            this.set(prefix, path);
        }
    }

    /**
     * Connects the given prefix and IRI.
     *
     * @param {String} prefix
     * The prefix to use.
     *
     * @param {String} iri
     * The IRI to use.
     *
     * @return {TermMap}
     * The TermMap to make the object chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri
     */
    set(prefix, iri) {
        this.prefixToPath.add(prefix, iri);
        return this;
    }

    /**
     * Tests if an entry for the given prefix exists.
     *
     * @param {String} prefix
     * The prefix to test.
     *
     * @return {Boolean}
     * Whether an entry for the given prefix exists.
     */
    hasPrefix(prefix) {
        return this.prefixToPath.hasX(prefix);
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
        return this.prefixToPath.hasY(iri);
    }

    /**
     * Removes the entry for the given prefix from this PrefixMap.
     *
     * @param {String} prefix
     * The prefix to remove.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-remove-omittable-deleter-void-DOMString-prefix
     */
    remove(prefix) {
        this.prefixToPath.deleteX(prefix);
    }

    /**
     * Given a valid CURIE for which a prefix is known, this method will return
     * the resulting IRI. If the prefix is not known then this method will
     * return null.
     *
     * @param {String} curie
     * The CURIE to resolve.
     *
     * @return {String}
     * The corresponding IRI.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-resolve-DOMString-DOMString-curie
     */
    resolve(curie) {
        const [prefix, name] = curie.split(":");
        const path = this.get(prefix);
        if (path) {
            return path + name;
        }
        return null;
    }

    /**
     * Given an IRI for which a prefix is known this method returns a CURIE. If
     * no prefix is known the original IRI is returned.
     *
     * @param {String} iri
     * The IRI to shrink.
     *
     * @return {String}
     * The corresponding CURIE.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri
     */
    shrink(iri) {
        let result = this.trySplit(iri, iri.lastIndexOf("#"));
        if (result) {
            return result;
        }

        result = this.trySplit(iri, iri.lastIndexOf("/"));
        if (result) {
            return result;
        }

        for (let [prefix, path] of this.prefixToPath) {
            if (iri.startsWith(path)) {
                const name = iri.slice(path.length);
                return `${prefix}:${name}`;
            }
        }

        return iri;
    }

    /**
     * Splits an IRI and tries to find the prefix corresponding to the first
     * part.
     *
     * @param {String} iri
     * The IRI to split.
     *
     * @param {splitIndex} Number
     * Where to split the IRI.
     *
     * @return {String}
     * If the lookup was successful a CURIE is returned.
     */
    trySplit(iri, splitIndex) {
        const path = iri.slice(0, splitIndex + 1);
        const name = iri.slice(splitIndex + 1);

        if (this.prefixToPath.hasY(iri)) {
            const prefix = this.prefixToPath.convertYToX(path);
            return `${prefix}:${name}`;
        }
    }

    /**
     * Sets the default IRI to be used when resolving CURIEs without prefix.
     *
     * @param {String} iri
     * The default IRI.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-setDefault-void-DOMString-iri
     */
    setDefault(iri) {
        this.set("", iri);
    }

    /**
     * Imports all entries from the given PrefixMap.
     *
     * @param {PrefixMap} prefixes
     * The PrefixMap to import.
     *
     * @param {Boolean} [override=false]
     * Whether conflicting entries in this map should be overriden by the ones
     * in the given map.
     *
     * @return {PrefixMap}
     * This PrefixMap to make the method chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override
     */
    addAll(prefixes, override = false) {
        for (let [prefix, path] of prefixes) {
            if (override || !this.prefixToPath.hasEither(prefix, path)) {
                this.set(prefix, path);
            }
        }
        return this;
    }

    /**
     * Yields all prefixes in this map.
     */
    * prefixes() {
        yield* this.prefixToPath.xs();
    }

    /**
     * Yields all IRIs in this map.
     */
    * iris() {
        yield* this.prefixToPath.ys();
    }

    /**
     * Yields all prefix-IRI-entries in this map.
     */
    * entries() {
        yield* this.prefixToPath.entries();
    }

    /**
     * Yields all prefix-IRI-entries in this map.
     */
    [Symbol.iterator]() {
        return this.entries();
    }

    /**
     * Returns a copy of this PrefixMap.
     *
     * @return {PrefixMap}
     * A copy of this PrefixMap.
     */
    clone() {
        return new PrefixMap(this);
    }
}
