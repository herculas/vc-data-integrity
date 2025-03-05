import * as rdf from "rdf-canonize"

import type { NQuad, RdfDataset } from "../types/serialize/rdf.ts"
import type { OneOrMany } from "../types/serialize/document.ts"

import type * as RdfOptions from "../types/api/rdf.ts"

/**
 * RDFC-1.0 canonically labels an RDF dataset by assigning each blank node a canonical identifier. In RDFC-1.0, an RDF
 * dataset is represented as a set of quads of the form `<s, p, o, g>`, where the graph component `g` is empty if and
 * only if the triple `<s, p, o>` is in the default graph.
 *
 * It is expected that, for two RDF datasets, RDFC-1.0 returns the same canonically labeled list of quads if and only if
 * the two datasets are isomorphic (i.e., the same modulo blank node identifiers).
 *
 * @param {OneOrMany<NQuad | RdfDataset>} input The RDF dataset to canonize.
 * @param {RdfOptions.Canonize} [options] The options to use.
 *
 * @returns {Promise<string | object>} Resolve to the canonically labeled RDF dataset.
 *
 * @see https://www.w3.org/TR/rdf-canon/#canon-algorithm
 */
export async function canonize(
  input: OneOrMany<NQuad | RdfDataset>,
  options: RdfOptions.Canonize,
): Promise<NQuad> {
  return await rdf.default.canonize(input, options)
}
