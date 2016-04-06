import n3 from "n3";
const n3Util = n3.Util;

import Graph     from "./Graph.js";
import Triple    from "./Triple.js";
import BlankNode from "./BlankNode.js";
import Literal   from "./Literal.js";
import NamedNode from "./NamedNode.js";
import Profile   from "./Profile.js";

export default class TurtleReader {
    constructor() {
        this.parser = n3.Parser();
    }

    parseWord(word, {allowBlank = true, allowNamed = true, allowLiteral = true} = {}) {
        if (allowBlank && n3Util.isBlank(word)) {
            return new BlankNode(word);
        } else if (allowNamed && n3Util.isIRI(word)) {
            return new NamedNode(word);
        } else if (allowLiteral && n3Util.isLiteral(word)) {
            const value    = n3Util.getLiteralValue(word);
            const language = n3Util.getLiteralLanguage(word); // TODO test if language and datatype exist
            const datatype = n3Util.getLiteralType(word);
            return new Literal(value, {language, datatype});
        } else {
            throw new Error(`Could not parse ${word}.`);
        }
    }

    parseTriple(triple) {
        const subject   = this.parseWord(triple.subject,   {allowLiteral: false});
        const predicate = this.parseWord(triple.predicate, {allowBlank: false, allowLiteral: false});
        const object    = this.parseWord(triple.object);
        return new Triple(subject, predicate, object);
    }

    async parse(toParse, {base = "", filter = ()=>true, graph = new Graph(), profile = new Profile()} = {}) { // TODO: base
        await this.parser.parse(
            toParse,
            (err, triple, prefixes) => {
                console.log(err, triple, prefixes)
                if (err) {
                    throw err;
                }
                if (triple) {
                    const triple = this.parseTriple(triple);
                    console.log(triple);
                    if (filter(triple)) {
                        graph.add(triple);
                    }
                }
                if (prefixes) {
                    console.log(graph.toString());
                    return graph; // TODO graph has to be pulled out
                }
            },
            ::profile.setPrefix
        );
        console.log(graph);
        console.log(graph.toString())
        return graph.toString();
    }

    * process(toParse, {base = "", profile = new RDFEnvironment()} = {}) { // TODO base
        this.parser.parse(
            toParse,
            (err, triple, prefixes) => {
                if (err) {
                    throw err;
                }
                if (triple) {
                    const triple = this.parseTriple(triple);
                    if (filter(triple)) {
                        //yield triple;
                    }
                }
                if (prefixes) {
                    return;
                }
            },
            ::profile.setPrefix
        );
    }
}