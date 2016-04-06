// readonly attribute Graph processorGraph;
// boolean parse (any toparse, ParserCallback? callback, optional DOMString base, optional TripleFilter filter, optional Graph graph);
// boolean process (any toparse, ProcessorCallback callback, optional DOMString base, optional TripleFilter filter);

import n3 from "n3";

import Graph   from "./Graph.js";
import Profile from "./Profile.js";

export default class TurtleReader {
    constructor() {
        this.parser = n3.Parser();
    }

    parse(toParse, {base = "", filter = ()=>true, graph = new Graph(), profile = new Profile()}) {

    }

    * process(toParse, {base = "", profile = new RDFEnvironment()}) {

    }
}