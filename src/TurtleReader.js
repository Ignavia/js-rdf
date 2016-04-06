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
            word = word.replace(/^_:b[0-9]+_/, "");
            return new BlankNode(word);
        } else if (allowNamed && n3Util.isIRI(word)) {
            return new NamedNode(word);
        } else if (allowLiteral && n3Util.isLiteral(word)) {
            const value    = n3Util.getLiteralValue(word);
            const language = n3Util.getLiteralLanguage(word) || undefined;
            const datatype = n3Util.getLiteralType(word)     || undefined;
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

    parse(s, { filter = ()=>true, graph = new Graph(), profile = new Profile() } = {}) {
        return new Promise((resolve, reject) => this.parser.parse(
            s,
            (err, n3Triple, prefixes) => {
                if (err) {
                    reject(err);
                }
                if (n3Triple) {
                    const triple = this.parseTriple(n3Triple);
                    if (filter(triple)) {
                        graph.add(triple);
                    }
                }
                if (prefixes) {
                    resolve({graph, profile});
                }
            },
            (prefix, iri) => {
                profile.setPrefix(prefix, iri);
            }
        ));
    }
}