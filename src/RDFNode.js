/**
 * Defines an interface for RDFNodes.
 * 
 * @see https://www.w3.org/TR/rdf-interfaces/#idl-def-RDFNode
 */
export default class RDFNode {
    
    /**
     * @param {String} interfaceName
     * The string name of the current interface. This is one of "NamedNode",
     * "BlankNode" and "Literal".
     * 
     * @param {*} nominalValue
     * The value of this RDFNode.
     */
    constructor(interfaceName, nominalValue) {
        
        /**
         * The string name of the current interface. This is one of "NamedNode",
         * "BlankNode" and "Literal".
         * 
         * @type {String}
         */
        this.interfaceName = interfaceName;
        
        /**
         * The value of this RDFNode.
         * 
         * @type {*}
         */
        this.nominalValue = nominalValue;
    }

    /**
     * Tests if this RDFNode is equivalent to the given value.
     * 
     * @param {*} toCompare
     * The value to test.
     * 
     * @return {Boolean}
     * If this RDFNode is equivalent to the given value. 
     * 
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-equals-boolean-any-tocompare
     */
    equals(toCompare) {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Provides access to the native value for this RDFNode.
     * 
     * @return {*}
     * The native value of this RDFNode.
     * 
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-valueOf-any
     */
    valueOf() {
        throw new Error("Calling an abstract method.");
    }
    
    /**
     * Returns the stringification of this RDFNode.
     * 
     * @return {String}
     * The stringification of this RDFNode.
     * 
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString
     */
    toString() {
        throw new Error("Calling an abstract method.");
    }

    /**
     * Returns the N-Triples representation of this RDFNode.
     * 
     * @return {String}
     * The N-Triples representation of this RDFNode.
     * 
     * @abstract
     * @see https://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toNT-DOMString 
     */
    toNT() {
        throw new Error("Calling an abstract method.");
    }
}

// Provide easy access to literals if a node is given !!!


// import {EventManager, observableMixin} from "@ignavia/util";

// import Literal from "./Literal.js";

// /**
//  * Describes the data to associate with a node of a graph in an RDF application.
//  *
//  * @author Lars Reimann
//  * @version 1.1.0
//  */
// export default class NodeData {

//     /**
//      * A helper function to turn a literal or its ID into an ID.
//      *
//      * @param {String|Literal} literal
//      * The literal or its ID.
//      *
//      * @return {String}
//      * The requested ID.
//      */
//     static toLiteralId(literal) {
//         if (typeof literal === "string") {
//             return literal;
//         } else if (literal instanceof Literal) {
//             return literal.id;
//         }
//     }

//     /**
//      * A helper function for other functions that can take a single literal ID,
//      * an iterator for literal IDs, a single literal or an iterator for
//      * literals and returns an iterable object.
//      *
//      * @param {String|Iterator<String>|Literal|Iterator<Literal>} literals
//      * The parameter to normalize.
//      *
//      * @return {Iterator<String>|Iterator<Literal>}
//      * The normalized parameter.
//      */
//     static makeLiteralsIterable(literals) {
//         if (typeof literals === "string" || literals instanceof Literal) {
//             return [literals];
//         }
//         return literals;
//     }

//     /**
//      * @param {String} nominalValue
//      * The IRI of the corresponding resource.
//      */
//     constructor(nominalValue) {

//         /**
//          * The IRI of the corresponding resource.
//          *
//          * @type {String}
//          */
//         this.nominalValue = nominalValue;

//         /**
//          * Maps from IDs of literals to the corresponding literals.
//          *
//          * @type {Map<String, Literal>}
//          */
//         this.literals = new Map();

//         /**
//          * Maps from a predicate to a set containing the IDs of literals with
//          * that predicate.
//          *
//          * @type {Map<String, Set<String>>}
//          * @private
//          */
//         this.literalsWithPredicate = new Map();

//         /**
//          * A counter to automatically provide IDs for RDFLiterals.
//          *
//          * @type {Number}
//          */
//         this.rdfLiteralId = 0;

//         this.eventManager = new EventManager();
//     }

//     /**
//      * Adds the given literals to this node.
//      *
//      * @param {Literal|Iterator<Literal>} literalObjs
//      * The literals to add.
//      *
//      * @return {NodeData}
//      * This object to make the method chainable.
//      */
//     addLiterals(literalObjs) {
//         literalObjs = NodeData.makeLiteralsIterable(literalObjs);

//         for (let literalObj of literalObjs) {
//             const predicate = literalObj.predicate;

//             literalObj.id = "l" + (this.rdfLiteralId++);
//             this.literals.set(literalObj.id, literalObj);
//             if (!this.literalsWithPredicate.has(predicate)) {
//                 this.literalsWithPredicate.set(predicate, new Set());
//             }
//             this.literalsWithPredicate.get(predicate).add(literalObj.id);
//         }

//         return this;
//     }

//     /**
//      * Removes the given literals from this node.
//      * @param {String|Iterator<String>|Literal|Iterator<Literal>} literals
//      * The literals to remove. Providing IDs is enough.
//      *
//      * @return {Literal[]}
//      * An array with the deleted literals.
//      */
//     removeLiteral(literals) {
//         literals = NodeData.makeLiteralsIterable(literals);

//         const deleted = [];

//         for (let literal of literalObjs) {
//             const literalObj = this.toLiteralObj(literal);
//             if (!literalObj) {
//                 continue;
//             }

//             const literalId             = literalObj.id,
//                   predicate             = literalObj.predicate,
//                   literalsWithPredicate = this.literalsWithPredicate.get(predicate);
//             this.literals.delete(literalId);
//             literalsWithPredicate.delete(id);
//             if (literalsWithPredicate.size === 0) {
//                 this.literalsWithPredicate.delete(predicate);
//             }

//             deleted.push(literalObj);
//         }

//         return deleted;
//     }

//     /**
//      * Returns the literal corresponding to the given ID.
//      *
//      * @param {String} literalId
//      * The ID of the literal to select.
//      *
//      * @return {Literal}
//      * The requested literal.
//      */
//     getLiteralById(literalId) {
//         return this.literals.get(literalId);
//     }

//     /**
//      * Iterates over the literals attached to this node. If the literals
//      * parameter is specified only those literals are considered. Furthermore
//      * if a filter function is provided only literals that pass the test are
//      * included.
//      *
//      * @param {Object} [options={}]
//      * Used for various options.
//      *
//      * @param {Function} [options.f=()=>true]
//      * The filter function to apply. It gets a literal as parameter.
//      *
//      * @param {String|Iterator<String>|Literal|Iterator<Literal>} [options.literals]
//      * Restricts the literals to iterate over. Passing in IDs is enough.
//      */
//     * iterLiterals({f = ()=>true, literals = this.literals.values()} = {}) {
//         literals = NodeData.makeLiteralsIterable(literals);

//         for (let literal of literals) {
//             const literalObj = this.toLiteralObj(literal);
//             if (literalObj && f(literalObj)) {
//                 yield literalObj;
//             }
//         }
//     }

//     /**
//      * Yields the IDs of the literals attached to this node.
//      */
//     * iterLiteralIds() {
//         yield* this.literals.keys();
//     }

//     /**
//      * Returns the number of literals attached to this node.
//      *
//      * @return {Number}
//      * The number of literals.
//      */
//     getNumberOfLiterals() {
//         return this.literals.size;
//     }

//     /**
//      * Yields all predicates of literals attached to this node.
//      */
//     * iterPredicates() {
//         yield* this.literalsWithPredicate.keys();
//     }

//     /**
//      * Yields all literals attached to this node by an edge with the given
//      * predicate.
//      *
//      * @param {String} predicate
//      * The predicate of the literals to yield.
//      */
//     * iterLiteralsWithPredicate(predicate) {
//         if (this.literals.has(predicate)) {
//             yield* this.literals.get(predicate).values();
//         }
//     }

//     equals(o) {
//         if (o instanceof Literal) {
//             return false;
//         }
//         if (o instanceof RDFNode) {
//             return this.nominalValue  === o.nominalValue &&
//                    this.interfaceName === o.interfaceName;
//         }
//         return this.valueOf() === o;
//     }

//     toString() {
//         if (this.interfaceName === "BlankNode") {
//             return `_:${this.nominalValue}`;
//         }
//         return `${this.nominalValue}`;
//     }

//     toNT() {
//         if (this.interfaceName === "BlankNode") {
//             return `_:${this.nominalValue}`;
//         }
//         return `<${this.nominalValue}>`;
//     }

//     valueOf() {
//         return `${this.nominalValue}`;
//     }

//     /**
//      * A helper function to turn a literal or its ID into an literal.
//      *
//      * @param {String|Literal} literal
//      * The literal or its ID.
//      *
//      * @return {Literal}
//      * The requested literal.
//      */
//     toLiteralObj(literal) {
//         if (typeof literal === "string") {
//             return this.getLiteralById(literal);
//         } else if (literal instanceof Literal) {
//             return this.getLiteralById(literal.id);
//         }
//     }
// }

// // Make node data observable
// Object.assign(NodeData.prototype, observableMixin);