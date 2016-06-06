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
            result += `@prefix ${prefix}: <${ns}> .\n`;
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

        for (let subject of graph.subjects()) {
            const nodeString          = this.serializeNode(profile, subject) + " ";
            const predicateListString = this.serializePredicateList(
                graph,
                profile,
                subject,
                nodeString.length
            );
            result += nodeString + predicateListString + ".\n";
        }

        return result;
    }

    /**
     * Serializes the predicate list of the given subject.
     *
     * @param {Graph} graph
     * The graph to serialize.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @param {RDFNode} subject
     * The subject to match.
     *
     * @param {Number} indentationLevel
     * How far to indent each line.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializePredicateList(graph, profile, subject, indentationLevel) {
        let result = "";
        let first = true;

        for (let predicate of graph.predicates(subject)) {
            const punctuation      = first ? "" : ";\n";
            const indentation      = first ? "" : this.indentation(indentationLevel);
            const nodeString       = this.serializeNode(profile, predicate) + " ";
            const objectListString = this.serializeObjectList(
                graph,
                profile,
                subject,
                predicate,
                indentationLevel + nodeString.length
            );
            result += punctuation + indentation + nodeString + objectListString;

            first = false;
        }

        return result;
    }

    /**
     * Serializes the object list of the given subject and predicate.
     *
     * @param {Graph} graph
     * The graph to serialize.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @param {RDFNode} subject
     * The subject to match.
     *
     * @param {RDFNode} predicate
     * The predicate to match.
     *
     * @param {Number} indentationLevel
     * How far to indent each line.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeObjectList(graph, profile, subject, predicate, indentationLevel) {
        let result = "";
        let first = true;

        for (let object of graph.objects(subject, predicate)) {
            const punctuation = first ? "" : ",\n";
            const indentation = first ? "" : this.indentation(indentationLevel);
            const nodeString  = this.serializeNode(profile, object) + " ";
            result += punctuation + indentation + nodeString;

            first = false;
        }

        return result;
    }

    /**
     * Serializes the given RDFNode.
     *
     * @param {Profile} profile
     * The profile used to shorten the IRIs of named nodes.
     *
     * @param {RDFNode} node
     * The node to serialize.
     *
     * @return {String}
     * The result.
     *
     * @private
     */
    serializeNode(profile, node) {
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
     * Creates a string with the given number of spaces.
     *
     * @param {Number} length
     * The length of the string.
     *
     * @private
     */
    indentation(length) {
        let result = "";
        for (let i = 0; i < length; i++) {
            result += " ";
        }
        return result;
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
