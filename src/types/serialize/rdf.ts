import type { BlankNode, IRI } from "./base.ts"

/**
 * N-Quads is a line-based, plain text format for encoding an RDF dataset. N-Quads statements are a sequence of RDF
 * terms representing the subject, predicate, object and graph label of an RDF triple and the graph it is part of in a
 * dataset. These may be separated by white space (spaces `#x20` or tabs `#x09`). This sequence is terminated by a `.`
 * and a new line (optional at the end of a document).
 */
export type NQuad = string

export type TermType = "NamedNode" | "BlankNode" | "Literal" | "DefaultGraph"

/**
 * An RDF dataset is a collection of RDF graphs, an comprises:
 *
 * - exactly one default graph, being a RDF graph. The default graph does not have a name and MAY be empty.
 * - zero or more named graphs, each being a pair consisting of an IRI or a blank node (the graph name), and an RDF
 *   graph. Graph names are unique within an RDF dataset.
 *
 * @see https://www.w3.org/TR/rdf11-concepts/#dfn-rdf-dataset
 * @see https://www.w3.org/TR/json-ld11-api/#dom-rdfdataset
 */
export type RdfDataset = Array<RdfTriple>

/**
 * An RDF triple consists of three components: the subject, predicate, and object. An RDF triple is conventionally
 * written in the order (subject, predicate, object), and is often referred to as a statement.
 *
 * It is possible for a predicate IRI to also occur as a node in the same graph.
 */
export type RdfTriple = {
  /**
   * A subject is an absolute IRI or blank node identifier denoting the subject of the triple.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-rdftriple-subject
   */
  subject: RdfTerm

  /**
   * A predicate is an absolute IRI denoting the predicate of the triple. If used to represent a generalized RDF
   * dataset, it may also be a blank node identifier.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-rdftriple-predicate
   */
  predicate: RdfTerm

  /**
   * A object is an absolute IRI, blank node identifier, or literal denoting the object of the triple.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-rdftriple-object
   */
  object: RdfTerm & RdfLiteral

  /**
   * A graph is an absolute IRI or blank node identifier denoting the graph of the triple. If used to represent a
   * generalized RDF dataset, it may also be a default graph.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-rdfgraph
   */
  graph: RdfTerm
}

/**
 * A subject is an absolute IRI or blank node identifier denoting the subject of the triple.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#dom-rdftriple-subject
 */
export type RdfTerm = {
  termType: TermType
  value: IRI | BlankNode
}

/**
 * Literals are used for values such as strings, numbers, and dates. A literal in an RDF graph consists of two or three
 * elements:
 *
 * - a lexical form: being a Unicode string, which SHOULD be in Normal Form C,
 * - a datatype IRI: being an IRI identifying the datatype that determines how the lexical form maps to a literal value,
 * - a language tag: a string as defined by [BCP47] identifying the language of the literal, if and only if the datatype
 *   IRI is equal to `http://www.w3.org/1999/02/22-rdf-syntax-ns#langString`.
 *
 * @see https://www.w3.org/TR/rdf11-concepts/#dfn-literal
 */
export type RdfLiteral = {
  dataType?: RdfTerm
  language?: string
}
