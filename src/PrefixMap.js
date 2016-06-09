import {Tolkien1To1Map} from "@ignavia/util";

/**
 * Maps from prefixes to IRIs and back.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#prefix-maps
 */
export default class PrefixMap {

    /**
     * @param {Array} [initialValue=[]]
     * An array with [term, iri] entries.
     */
    constructor(initialValues = []) {

        /**
         * Maps from prefixes to IRIs and back.
         *
         * @type {Tolkien1To1Map}
         * @private
         */
        this.prefixToNamespace = new Tolkien1To1Map();

        // Add initial values
        for (let [prefix, ns] of initialValues) {
            this.set(prefix, ns);
        }
    }

    /**
     * The number of entries in this PrefixMap.
     *
     * @type {Number}
     */
    get size() {
        return this.prefixToNamespace.size;
    }

    /**
     * Connects the given prefix and namespace.
     *
     * @param {String} prefix
     * The prefix to use.
     *
     * @param {String} ns
     * The namespace to use.
     *
     * @return {TermMap}
     * The TermMap to make the object chainable.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri
     */
    set(prefix, ns) {
        this.prefixToNamespace.add(prefix, ns);
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
        return this.prefixToNamespace.hasX(prefix);
    }

    /**
     * Tests if an entry for the given namespace exists.
     *
     * @param {String} ns
     * The namespace to test.
     *
     * @return {Boolean}
     * Whether an entry for the given namespace exists.
     */
    hasNamespace(ns) {
        return this.prefixToNamespace.hasY(ns);
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
        this.prefixToNamespace.deleteX(prefix);
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
        const [prefix, name = ""] = curie.split(":");
        const ns = this.prefixToNamespace.convertXToY(prefix)[0];
        if (ns) {
            return ns + name;
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

        for (let [prefix, ns] of this.prefixToNamespace) {
            if (iri.startsWith(ns)) {
                const name = iri.slice(ns.length);
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
     *
     * @private
     */
    trySplit(iri, splitIndex) {
        const ns   = iri.slice(0, splitIndex + 1);
        const name = iri.slice(splitIndex + 1);

        if (this.prefixToNamespace.hasY(iri)) {
            const prefix = this.prefixToNamespace.convertYToX(ns)[0];
            return `${prefix}:${name}`;
        }
    }

    /**
     * Sets the default namespace to be used when resolving CURIEs without prefix.
     *
     * @param {String} ns
     * The default namespace.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-setDefault-void-DOMString-iri
     */
    setDefault(ns) {
        this.set("", ns);
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
        for (let [prefix, ns] of prefixes) {
            if (override || !this.prefixToNamespace.hasEither(prefix, ns)) {
                this.set(prefix, ns);
            }
        }
        return this;
    }

    /**
     * Yields all prefixes in this map.
     */
    * prefixes() {
        yield* this.prefixToNamespace.xs();
    }

    /**
     * Yields all namespaces in this map.
     */
    * namespaces() {
        yield* this.prefixToNamespace.ys();
    }

    /**
     * Yields all prefix-IRI-entries in this map.
     */
    * entries() {
        yield* this.prefixToNamespace.entries();
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
