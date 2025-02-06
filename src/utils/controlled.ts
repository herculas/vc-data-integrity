import { cloneDeep, isEqual } from "@es-toolkit/es-toolkit"

import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/code.ts"

import type { CIDDocument } from "../types/data/cid.ts"
import type { Context } from "../types/jsonld/keywords.ts"
import type { JsonLdDocument, JsonLdObject } from "../types/jsonld/base.ts"
import type { URI } from "../types/jsonld/literals.ts"
import type { VerificationMethod, VerificationRelationship } from "../types/data/method.ts"

import type * as DocumentOptions from "../types/api/document.ts"
import type * as Result from "../types/api/result.ts"

/**
 * Retrieve a verification method, such as a cryptographic public key, by using a verification method identifier.
 *
 * @param {URI} vmIdentifier The verification method identifier.
 * @param {VerificationRelationship} [verificationRelationship] The verification relationship.
 * @param {RetrieveOptions} options The dereferencing options.
 *
 * @returns {Promise<VerificationMethod>} Resolve to a verification method object.
 *
 * @see https://www.w3.org/TR/cid/#retrieve-verification-method
 */
export async function retrieveVerificationMethod(
  vmIdentifier: URI,
  verificationRelationship: VerificationRelationship | undefined,
  options: DocumentOptions.Retrieve,
): Promise<VerificationMethod> {
  // Procedure:
  //
  // 1. If `vmIdentifier` is not a valid URL, an error MUST be raised and SHOULD convey an error type of
  //    `INVALID_VERIFICATION_METHOD_URL`.
  // 2. Let `controllerDocumentUrl` be the result of parsing `vmIdentifier` according to the rules of the URL scheme
  //    and extracting the primary resource identifier (without the fragment identifier).
  // 3. Let `vmFragment` be the result of parsing `vmIdentifier` according to the rules of the URL scheme and extracting
  //    the secondary resource identifier (the fragment identifier).
  // 4. Let `controllerDocument` be the result of dereferencing `controllerDocumentUrl`, according to the rules of the
  //    URL scheme and using the supplied `options`.
  // 5. If `controllerDocument` is not a conforming controlled identifier document, an error MUST be raised and SHOULD
  //    convey an error type of `INVALID_CONTROLLED_IDENTIFIER_DOCUMENT`.
  // 6. If `controllerDocument` does not match the `controllerDocumentUrl`, an error MUST be raised and SHOULD convey an
  //    error type of `INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID`.
  // 7. Let `verificationMethod` be the result of dereferencing the `vmFragment` from the `controllerDocument` according
  //    to the rules of the media type of the `controllerDocument`.
  // 8. If `verificationMethod` is not a conforming verification method, an error MUST be raised and SHOULD convey an
  //    error type of `INVALID_VERIFICATION_METHOD`.
  // 9. If the absolute URL value of `verificationMethod.id` does not equal `vmIdentifier`, an error MUST be raised and
  //    SHOULD convey an error type of `INVALID_VERIFICATION_METHOD`.
  // 10.  If the absolute URL value of `verificationMethod.controller` does not equal `controllerDocumentUrl`, an error
  //      MUST be raised and SHOULD convey an error type of `INVALID_VERIFICATION_METHOD`.
  // 11.  If `verificationMethod` is not associated, either by reference (URL) or by value (object), with the
  //      verification relationship array in the `controllerDocument` identified by `verificationRelationship`, an error
  //      MUST be raised and SHOULD convey an error type of `INVALID_RELATIONSHIP_FOR_VERIFICATION_METHOD`.
  // 12.  Return `verificationMethod` as the verification method.

  if (!URL.canParse(vmIdentifier)) {
    throw new DataIntegrityError(
      ErrorCode.INVALID_VERIFICATION_METHOD_URL,
      "jsonld#retrieve",
      "Invalid verification method identifier.",
    )
  }

  const vmIdentifierUrl = new URL(vmIdentifier)
  const vmFragment = vmIdentifierUrl.hash
  const controllerDocumentUrl = vmIdentifier.replace(vmFragment, "")

  const controllerDocument = await options.documentLoader(controllerDocumentUrl).then(
    (response) => response.document as CIDDocument,
    () => {
      throw new DataIntegrityError(
        ErrorCode.INVALID_CONTROLLED_IDENTIFIER_DOCUMENT,
        "jsonld#retrieve",
        "Invalid controlled identifier document.",
      )
    },
  )

  if (controllerDocument.id !== controllerDocumentUrl) {
    throw new DataIntegrityError(
      ErrorCode.INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID,
      "jsonld#retrieve",
      "Invalid controlled identifier document identifier.",
    )
  }

  const verificationMethod = resoluteFragment(controllerDocument, vmFragment) as VerificationMethod
  if (!verificationMethod) {
    throw new DataIntegrityError(
      ErrorCode.INVALID_VERIFICATION_METHOD,
      "jsonld#retrieve",
      "Invalid verification method.",
    )
  }

  if (verificationMethod.id !== vmIdentifier) {
    throw new DataIntegrityError(
      ErrorCode.INVALID_VERIFICATION_METHOD,
      "jsonld#retrieve",
      "Invalid verification method identifier.",
    )
  }

  if (verificationMethod.controller !== controllerDocumentUrl) {
    throw new DataIntegrityError(
      ErrorCode.INVALID_VERIFICATION_METHOD,
      "jsonld#retrieve",
      "Invalid verification method controller.",
    )
  }

  return verificationMethod
}

/**
 * Retrieve the portion of a document that contains a given fragment identifier.
 *
 * While it is possible to express a document that contains multiple fragments that use the same identifier, due to
 * interoperability concerns, doing so is to be avoided and the behavior is not defined.
 *
 * @param {CIDDocument} document A controlled identifier document to retrieve the fragment from.
 * @param {string} fragmentIdentifier The fragment identifier.
 *
 * @returns {JsonLdDocument} Resolve to the document fragment.
 *
 * @see https://www.w3.org/TR/cid/#fragment-resolution
 */
export function resoluteFragment(document: CIDDocument, fragmentIdentifier: string): JsonLdDocument | undefined {
  // Procedure:
  //
  // 1. Let `documentFragment` be `null`.
  // 2. Let `canonicalDocumentUrl` be the value of `document.id`.
  // 3. Let `fullyQualifiedFragment` be the value of `canonicalDocumentUrl` with `fragmentIdentifier` appended to it.
  // 4. Recursively process every map in `document` checking to see if it has an `id` value that is equal to
  //    `fullyQualifiedFragment` or `fragmentIdentifier`. If a match is found, set `documentFragment` to the matched
  //    map and stop the recursion.
  // 5. Return `documentFragment`.

  const canonicalDocumentUrl = document.id
  const fullyQualifiedFragment = canonicalDocumentUrl + fragmentIdentifier

  /**
   * Recursively find a fragment in a given document by checking if the document contains a fragment with the specified
   * `id` value that matches the given set of identifiers.
   *
   * @param {JsonLdDocument} map The document to search.
   * @param {Set<URI>} identifiers The set of identifiers to match.
   *
   * @returns {JsonLdDocument} A conforming document fragment, if any.
   */
  const recursiveFindFragment = (map: JsonLdDocument, identifiers: Set<URI>): JsonLdDocument | undefined => {
    if (Array.isArray(map)) { // map is an array, process the items in the array
      for (const item of map) {
        const fragment = recursiveFindFragment(item as JsonLdDocument, identifiers)
        if (fragment) return fragment
      }
    } else if (typeof map === "object") { // map is an object
      if (map.id && typeof map.id === "string" && identifiers.has(map.id)) return map

      for (const key in map) { // map itself is an object, but not the target, process the keys in the object
        const fragment = recursiveFindFragment(map[key] as JsonLdDocument, identifiers)
        if (fragment) return fragment
      }
    } else { // map is not an object nor an array
      return undefined
    }
  }

  const documentFragment = recursiveFindFragment(document, new Set([fullyQualifiedFragment, fragmentIdentifier]))
  return documentFragment
}

/**
 * Check if an application understands the contexts associated with a document before it executed business rules
 * specific to the input in the document.
 *
 * @param {JsonLdDocument} inputDocument The input document to validate.
 * @param {Context} knownContext The set of known contexts that the application understands.
 * @param {boolean} [recompact] A flag to indicate if the input document should be re-compacted.
 *
 * @returns {Promise<Result.Validation>} Resolve to a validation result.
 *
 * @see https://www.w3.org/TR/vc-data-integrity/#context-validation
 * @see https://www.w3.org/TR/vc-data-integrity/#validating-contexts
 */
export async function validateContext(
  inputDocument: JsonLdObject,
  knownContext: Context,
  recompact: boolean = false,
): Promise<Result.Validation> {
  // Procedure:
  //
  // 1. Set `result.validated` to `false`, `result.warnings` to an empty list, `result.errors` to an empty list,
  //    `compactionContext` to an empty list, and clone `inputDocument` to `result.validatedDocument`.
  // 2. Let `contextValue` be the value of the `@context` property of `result.validatedDocument`, which might be
  //    undefined.
  // 3. If `contextValue` does not deeply equal `knownContext`, any subtree in `result.validatedDocument` contains an
  //    `@context` property, or any URI in `contextValue` dereferences to a JSON-LD Context file that does not match
  //    a known good value or cryptographic hash, then perform the applicable action:
  //
  //    3.1. If `recompact` is `true`, set `result.validatedDocument` to the result of running the JSON-LD Compaction
  //         Algorithm with the `inputDocument` and `knownContext` as inputs. If the compaction fails, add at least one
  //         error to `result.errors`.
  //    3.2. If `recompact` is `false`, add at least one error to `result.errors`.
  //
  // 4. If `result.errors` is empty, set `result.validated` to `true`; otherwise, set `result.validated` to `false`, and
  //    remove the `document` property from `result`.
  // 5. Return the value of `result`.

  const result: Result.Validation = {
    validated: false,
    warnings: [],
    errors: [],
    validatedDocument: cloneDeep(inputDocument),
  }

  const contextValue = (result.validatedDocument as JsonLdObject)["@context"]

  // check if `contextValue` deeply equals to `knownContext`
  const check1 = isEqual(contextValue, knownContext)

  // check if any subtree in `result.validatedDocument` contains an `@context` property

  // check if any URI in `contextValue` dereferences to a JSON-LD Context file that does not match a known good value or cryptographic hash
  return result
}

/**
 * Check if any subtree in the input map contains a property with the specified key.
 *
 * @param {JsonLdDocument} map The input map to check.
 * @param {string} key The key to search for.
 *
 * @returns {boolean} `true` if the key is found; otherwise, `false`.
 */
function checkProperty(map: JsonLdDocument, key: string): boolean {
  for (const k in map) {
    // key-value is a scaler
    if (k === key) return true

    // key-value is an array
    if (Array.isArray(map[k])) {
      for (const item of map[k]) {
        if (typeof item === "object" && item !== null) {
          if (checkProperty(item as JsonLdDocument, key)) return true
        }
      }
    }

    // key-value is an object
    if (typeof map[k] === "object" && map[k] !== null) {
      if (checkProperty(map[k] as JsonLdDocument, key)) return true
    }
  }
  return false
}
