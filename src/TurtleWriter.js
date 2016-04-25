import Profile from "./Profile.js";

/**
 * Transforms a graph into a Turtle string.
 *
 * @see https://www.w3.org/TR/rdf-interfaces/#data-serializers
 */
export default class TurtleWriter {

    /**
     *
     */
    constructor() {}

    /**
     * Serializes the given profile.
     *
     * @param {Profile} profile
     * The profile to serialize.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeProfile(profile) {
        let result = "";
        for (let [prefix, ns] of profile.prefixes) {
            if (prefix === "") {
                result += `@base <${ns}> .\n`;
            } else {
                result += `@prefix ${prefix}: <${ns}> .\n`;
            }
        }
        return result;
    }

    /**
     * Serializes the given graph.
     *
     * @param {Graph} graph
     * The graph to serialize.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeGraph(graph, profile) {
        let result = "";
        for (let triple of graph) {
            result += this.serializeTriple(triple, profile);
        }
        return result;
    }

    /**
     * Serializes the given triple.
     *
     * @param {Triple} triple
     * The triple to serialize.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeTriple(triple, profile) {
        let result = "";
        result += this.serializeNode(triple.subject,   profile) + " ";
        result += this.serializeNode(triple.predicate, profile) + " ";
        result += this.serializeNode(triple.object,    profile) + " .\n";
        return result;
    }

    /**
     * Serializes the given RDFNode.
     *
     * @param {RDFNode} node
     * The node to serialize.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeNode(node, profile) {
        if (node.interfaceName === "NamedNode") {
            let expanded = node.toString();
            let shrunk   = profile.prefixes.shrink(expanded);
            if (expanded === shrunk) {
                return `<${expanded}>`;
            } else {
                return shrunk;
            }
        } else {
            return node.toNT();
        }
    }

    /**
     * Turns a graph into a Turtle string.
     *
     * @param {Graph} graph
     * The graph to serialize.
     *
     * @param {Profile} [profile]
     * The profile used to shorten the IRIs of named nodes.
     *
     * @return {String}
     * The Turtle string.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-DataSerializer-serialize-any-Graph-graph
     */
    serialize(graph, profile = new Profile()) {
        return this.serializeProfile(profile) + this.serializeGraph(graph, profile);
    }
}
