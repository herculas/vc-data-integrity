import * as jsonld from "jsonld"

import * as CONTEXT_URL from "../context/url.ts"
import type { CanonizeOptions } from "../types/interface/jsonld.ts"
import type { Context } from "../types/jsonld/keywords.ts"
import type { DIDURL } from "../types/did/keywords.ts"
import type { Frame, PlainDocument } from "../types/jsonld/document.ts"
import type { FrameOptions } from "../types/interface/jsonld.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { Proof } from "../types/did/proof.ts"

/**
 * Perform the RDF dataset canonicalization on the specified input, which should be a JSON-LD document unless the
 * `inputFormat` field is specified in the options. The output should be an RDF dataset unless the `format` field is
 * specified in the options.
 *
 * The canonization process sets `safe` to `true` and `base` to `null` by default, in order to produce safe outputs
 * and "fail closed".
 *
 * @param {object} input The document to canonize.
 * @param {CanonizeOptions} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized object.
 */
export async function canonize(input: PlainDocument, options: CanonizeOptions): Promise<string> {
  return await jsonld.default.canonize(input, options)
}

/**
 * Canonize a JSON-LD document using the URDNA2015 algorithm.
 *
 * @param {PlainDocument} input The document to canonize.
 * @param {Loader} loader A loader for external documents.
 * @param {boolean} skipExpansion Whether to skip the expansion step.
 *
 * @returns {Promise<string>} Resolve to the canonized document.
 */
export async function canonizeDocument(
  input: PlainDocument,
  loader: Loader,
  skipExpansion: boolean = false,
): Promise<string> {
  return await canonize(input, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader: loader,
    skipExpansion: skipExpansion,
  })
}

/**
 * Canonize a integrity proof using the URDNA2015 algorithm.
 *
 * @param {Proof} proof The proof to canonize.
 * @param {Loader} loader A loader for external documents.
 *
 * @returns {Promise<string>} Resolve to the canonized proof.
 */
export async function canonizeProof(
  proof: Proof,
  loader: Loader,
  context?: Context,
  skipExpansion: boolean = false,
): Promise<string> {
  // make a copy of the proof
  const proofCopy = { ...proof }

  // set the context of the proof
  proofCopy["@context"] = context || CONTEXT_URL.CREDENTIAL_V2

  // delete the nonce and proofValue fields
  delete proofCopy.nonce
  delete proofCopy.proofValue

  // canonize the proof
  return await canonize(proofCopy, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader: loader,
    skipExpansion: skipExpansion,
  })
}

/**
 * Perform the JSON-LD framing.
 *
 * @param {PlainDocument | DIDURL} input The document to frame.
 * @param {Frame} frame The frame to use.
 * @param {FrameOptions} options The options.
 *
 * @returns {Promise<PlainDocument>} Resolve to the framed object.
 */
export async function frame(
  input: PlainDocument | DIDURL,
  frame: Frame,
  options: FrameOptions,
): Promise<PlainDocument> {
  return await jsonld.default.frame(input, frame, options)
}
