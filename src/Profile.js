import PrefixMap from "./PrefixMap.js";
import TermMap   from "./TermMap.js";

/**
 * Provides an easy to use context for negotiating between CURIEs, Terms and
 * IRIs.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#profiles
 */
export default class Profile {

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
    constructor({ prefixes = new PrefixMap(), terms = new TermMap() } = {}) {

        /**
         * The prefix map.
         *
         * @type {PrefixMap}
         * @private
         */
        this.prefixes = prefixes;

        /**
         * The term map.
         *
         * @type {TermMap}
         * @private
         */
        this.terms = terms;
    }

    /**
     * Given an term or CURIE this method will return an IRI.
     *
     * @param {String} toResolve
     * A string term or CURIE.
     *
     * @return {String}
     * The corresponding IRI.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-resolve-DOMString-DOMString-toresolve
     */
    resolve(toResolve) {
        if (toResolve.includes(":")) {
            return this.prefixes.resolve(toResolve);
        } else {
            return this.terms.resolve(toResolve);
        }
    }

    /**
     * This method sets the default prefix for use when resolving CURIEs without
     * a prefix, for example ":me"
     *
     * @param {String} iri
     * The IRI to use as the default prefix.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultPrefix-void-DOMString-iri
     */
    setDefaultPrefix(iri) {
        this.prefixes.setDefault(iri);
    }

    /**
     * This method associates an IRI with a prefix.
     *
     * @param {String} prefix
     * The prefix to set. It must not contain any whitespace.
     *
     * @param {String} iri
     * The IRI to associate with the prefix.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-setPrefix-void-DOMString-prefix-DOMString-iri
     */
    setPrefix(prefix, iri) {
        this.prefixes.set(prefix, iri);
    }


    /**
     * This method sets the default vocabulary for use when resolving unknown
     * terms.
     *
     * @param {String} iri
     * The IRI to use as the default vocabulary.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultVocabulary-void-DOMString-iri
     */
    setDefaultVocabulary(iri) {
        this.terms.setDefault(iri);
    }

    /**
     * This method associates an IRI with a term.
     *
     * @param {String} term
     * The term to set. It must not contain any whitespace or the
     * : (single-colon) character.
     *
     * @param {String} iri
     * The IRI to associate with the term.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-setTerm-void-DOMString-term-DOMString-iri
     */
    setTerm(term, iri) {
        this.terms.set(term, iri);
    }

    /**
     * This method adds all prefixes and terms from the given profile. It allows
     * easy updating and merging of different profiles, such as those exposed
     * by parsers.
     *
     * @param {Profile} profile
     * The profile to import.
     *
     * @param {Boolean} override
     * If true then conflicting terms and prefixes will be overridden by those
     * specified on the Profile being imported. By default imported terms and
     * prefixes augment the existing set.
     *
     * @return {Profile}
     * This profile to allow chaining.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override
     */
    importProfile(profile, override = false) {
        this.prefixes.addAll(profile.prefixes, override);
        this.terms.addAll(profile.terms, override);
    }

    /**
     * Returns a copy of this Profile.
     *
     * @return {Profile}
     * A copy of this Profile.
     */
    clone() {
        return new Profile({
            prefixes: this.prefixes.clone(),
            terms:    this.terms.clone()
        });
    }
}
