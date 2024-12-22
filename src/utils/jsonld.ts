import * as jsonld from "jsonld"
import { SECURITY_CONTEXT_V2_URL } from "../context/constants.ts"
import type { ContextURL } from "../types/jsonld/keywords.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { MethodMap } from "../types/did/method.ts"
import type * as Options from "../types/interface/options.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"

/**
 * Canonize an object using the given options.
 *
 * @param {object} input The document to canonize.
 * @param {Options.Canonize} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized object.
 */
export async function canonize(input: object, options: Options.Canonize): Promise<string> {
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
export async function canonizeProof(proof: Proof, loader: Loader): Promise<string> {
  proof["@context"] = SECURITY_CONTEXT_V2_URL
  delete proof.nonce
  delete proof.proofValue
  return await canonize(proof, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader: loader,
    skipExpansion: false,
  })
}

export async function expandController(
  document: PlainDocument,
  controller: string,
  term: string,
  verificationId: string,
  loader: Loader,
): Promise<PlainDocument> {
  const framed = await jsonld.default.frame(document, {
    "@context": SECURITY_CONTEXT_V2_URL,
    id: controller,
    [term]: {
      "@embed": "@never",
      id: verificationId,
    },
  }, {
    documentLoader: loader,
    compactToRelative: false,
    safe: true,
  })
  if (!framed) {
    throw new Error(`Controller ${controller} not found.`)
  }
  return framed
}

export async function expandVerificationMethod(
  loader: Loader,
  verificationMethod?: string,
): Promise<MethodMap> {
  if (!verificationMethod) {
    throw new Error("Verification method not found.")
  }
  const framed = await jsonld.default.frame(verificationMethod, {
    "@context": SECURITY_CONTEXT_V2_URL,
    "@embed": "@always",
    id: verificationMethod,
  }, {
    documentLoader: loader,
    compactToRelative: false,
    expandContext: SECURITY_CONTEXT_V2_URL,
  })
  if (!framed) {
    throw new Error(`Verification method ${verificationMethod} not found.`)
  }
  return framed
}

/**
 * Check if a provided document includes a context URL in its `@context` property.
 *
 * @param {PlainDocument} document A JSON-LD document.
 * @param {ContextURL} context The context URL to check.
 *
 * @returns {boolean} `true` if the context is included, `false` otherwise.
 */
export function includeContext(document: PlainDocument, context: ContextURL): boolean {
  const fromContext = document["@context"]
  if (context === fromContext) {
    return true
  } else if (Array.isArray(fromContext)) {
    return fromContext.includes(context)
  }
  return false
}
