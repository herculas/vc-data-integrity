import * as jsonld from "jsonld"
import { SECURITY_CONTEXT_V2_URL } from "../context/constants.ts"
import type { ContextURL } from "../types/jsonld/keywords.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Loader } from "../types/interface/loader.ts"
import type * as Options from "../types/interface/options.ts"
import type { MethodMap } from "../types/did/method.ts"

/**
 * Canonize an object using the URDNA2015 algorithm.
 *
 * @param {object} input The document to canonize.
 * @param {Options.Canonize} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized document.
 */
export async function canonize(input: object, options: Options.Canonize): Promise<string> {
  return await jsonld.default.canonize(input, options)
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

export async function expandMethod(method: string, loader: Loader): Promise<MethodMap> {
  const framed = await jsonld.default.frame(method, {
    "@context": SECURITY_CONTEXT_V2_URL,
    "@embed": "@always",
    id: method,
  }, {
    documentLoader: loader,
    compactToRelative: false,
    expandContext: SECURITY_CONTEXT_V2_URL,
  })
  if (!framed) {
    throw new Error(`Verification method ${method} not found.`)
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
  if (Array.isArray(document)) {
    document = document[0]
  }
  const fromContext = document["@context"]
  if (context === fromContext) {
    return true
  } else if (Array.isArray(fromContext)) {
    return fromContext.includes(context)
  }
  return false
}
