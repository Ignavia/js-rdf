/**
 * Transforms a graph into a turtle string.
 */
export default class TurtleWriter {

    /**
     *
     */
    constructor() {}

    /**
     * Turns a graph into a turtle string.
     *
     * @param {Graph}
     * The graph to serialize.
     *
     * @return {String}
     * The turtle string.
     */
    serialize(graph) {
        return graph.toString();
    }
}

// TODO: use the profile to shrink expanded names back to curies