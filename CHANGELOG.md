# Changelog

## 2.1.0 (2016-06-23)

* Added a factory method to the RDFNode class to create instances using their N-Triples serialization.
* Added getters to the BlankNode, Literal and NamedNode class for their nominal values.

## 2.0.0 (2016-06-18)

* Added a method to test if a node or an equivalent one exists in the graph.
* Renamed the has method to hasTriple.

## 1.8.0 (2016-06-18)

* Added a method to loop over the nodes in the graph.

## 1.7.0 (2016-06-11)

* Added the option to use IDs instead of nodes and triples where applicable.

## 1.6.0 (2016-06-07)

* Added checks if a subject or subject/predicate-combination have literals.

## 1.5.0 (2016-06-06)

* Added iterators for subject, predicates (given a subject) and objects (given subject and predicate).
* Enhanced the TurtleWriter to use predicate and object list.

## 1.4.0 (2016-06-06)

* Added maps from IDs to nodes and triples.

## 1.3.0 (2016-04-25)

* Enhanced the Turtle writer to use prefixes.

## 1.2.0 (2016-04-08)

* Added the method `nodeToString` to instances of Profile.
* Added IDs to nodes, triples and graphs.

## 1.1.0 (2016-04-07)

* Added a parser and writer for Turtle strings.