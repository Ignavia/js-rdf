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
     * Turns a graph into a Turtle string.
     *
     * @param {Graph} graph
     * The graph to serialize.
     *
     * @return {String}
     * The Turtle string.
     *
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-DataSerializer-serialize-any-Graph-graph
     */
    serialize(graph) {
        return graph.toString();
    }
}

// TODO: use the profile to shrink expanded names back to curies