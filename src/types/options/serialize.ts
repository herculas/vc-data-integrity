import type { ContextDefinition } from "../serialize/context.ts"
import type { LoadDocumentCallback } from "../serialize/loader.ts"

/**
 * Common options for JSON-LD operations.
 */
interface Base {
  /**
   * The base IRI to use when expanding or compacting a JSON-LD document.
   *
   * If set, this overrides the input document's IRI.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-base
   */
  base?: string

  /**
   * A context that is used to initialize the active context when expanding a document.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-expandcontext
   */
  expandContext?: ContextDefinition
}

/**
 * Options containing an optional document loader.
 */
interface Loader {
  /**
   * The callback of the loader to be used to retrieve remote documents and contexts, implementing the
   * `LoadDocumentCallback` interface.
   *
   * If specified, it is used to retrieve remote documents and contexts; otherwise, if not specified, the processor's
   * built-in loader is used.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-documentloader
   */
  documentLoader?: LoadDocumentCallback
}

/**
 * Options for compacting a JSON-LD document.
 */
export interface Compact extends Base, Loader {
  /**
   * Whether to compact arrays to single values when appropriate.
   *
   * If set to `true`, the JSON-LD processor replaces arrays with just one element with that element during compaction.
   * If set to `false`, all arrays will remain arrays even if they have just one element.
   *
   * The default is `true`.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-compactarrays
   */
  compactArrays?: boolean

  /**
   * Determine if IRIs are compacted relative to the `base` option or document location when compacting.
   *
   * If set to `true`, IRIs will be compacted relative to the `base` option or document location when compacting. If set
   * to `false`, IRIs will always be compacted as absolute IRIs.
   *
   * The default is `true`.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-compacttorelative
   */
  compactToRelative?: boolean

  /**
   * Whether to always output a top-level graph, `true` to always output a top-level graph. The default is `false`.
   */
  graph?: boolean

  /**
   * Whether to skip expansion when serializing, `true` to assume the input is expanded and skip the expansion step,
   * `false` not to expand the input before serializing. The default is `false`.
   *
   * Some well-formed and safe-mode checks may be omitted.
   */
  skipExpansion?: boolean

  /**
   * If compaction is occurring during a framing operation. The default is `false`.
   */
  framing?: boolean

  /**
   * Whether to use the safe mode. The default is `false`, which is different from the other operations.
   */
  safe?: boolean
}

/**
 * Options for expanding a JSON-LD document.
 */
export interface Expand extends Base, Loader {
  /**
   * Whether to keep free-floating nodes, `true` to keep free-floating nodes, `false` to drop them. The default is
   * `false`.
   */
  keepFreeFloatingNodes?: boolean

  /**
   * Whether to use the safe mode. The default is `false`, which is different from the other operations.
   */
  safe?: boolean
}

/**
 * Options for flattening a JSON-LD document.
 */
export interface Flatten extends Base, Loader {}

/**
 * Options for framing a JSON-LD document.
 */
export interface Frame extends Base, Loader {
  /**
   * Set the default `@embed` flag for the frame, could be `@last`, `@always`, `@never`, or `@link`. The default is
   * `@last`.
   */
  embed?: string

  /**
   * Set the default `@explicit` flag for the frame. The default is `false`.
   */
  explicit?: boolean

  /**
   * Set the default `@requireAll` flag for the frame. The default is `true`.
   */
  requireAll?: boolean

  /**
   * Set the default `@omitDefault` flag for the frame. The default is `false`.
   */
  omitDefault?: boolean

  /**
   * Whether to use the safe mode. The default is `true`.
   */
  safe?: boolean
}

/**
 * Options for canonizing a JSON-LD document.
 */
export interface Normalize extends Base, Loader {
  /**
   * The normalization algorithm to be used, either 'URDNA2015' or 'URGNA2012'. The default is 'URDNA2015'.
   */
  algorithm?: string

  /**
   * Whether to skip expansion when serializing, `true` to assume the input is expanded and skip the expansion step,
   * `false` not to expand the input before serializing. The default is `false`.
   *
   * Some well-formed and safe-mode checks may be omitted.
   */
  skipExpansion?: boolean

  /**
   * The input format to use, if the input is not a JSON-LD document. The default is 'application/n-quads' for N-Quads.
   */
  inputFormat?: string

  /**
   * The output format to use, if the output is a string. The default is 'application/n-quads' for N-Quads.
   */
  format?: string

  /**
   * Whether to use a native canonization algorithm, if available.
   */
  useNative?: boolean

  /**
   * Determine how value objects containing a base direction are transformed to and from RDF.
   *
   * If set to `i18n-datatype`, an RDF literal is generated using a datatype IRI based on `https://www.w3.org/ns/i18n#`
   * with both the language tag (if present) and base direction encoded. When transforming from RDF, this datatype is
   * decoded to create a value object containing `@language` (if present) and `@direction`.
   * If set to `compound-literal`, a blank node is emitted instead of a literal, where the blank node is the subject of
   * `rdf:value`, `rdf:direction`, and `rdf:language` (if present) properties. When transforming from RDF, this object
   * is decoded to create a value object containing `@language` (if present), and `@direction`.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-rdfdirection
   */
  rdfDirection?: string | null

  /**
   * Whether to use the safe mode. The default is `true`.
   */
  safe?: boolean
}

export interface ToRdf extends Base, Loader {
  /**
   * Whether to skip expansion when serializing, `true` to assume the input is expanded and skip the expansion step,
   * `false` not to expand the input before serializing. The default is `false`.
   *
   * Some well-formed and safe-mode checks may be omitted.
   */
  skipExpansion?: boolean

  /**
   * The output format to use, if the output is a string. The default is 'application/n-quads' for N-Quads.
   */
  format?: string

  /**
   * If set to `true`, the JSON-LD processor may emit blank nodes for triple predicates. Otherwise, it will be omitted.
   *
   * The default is `false`.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-producegeneralizedrdf
   */
  produceGeneralizedRdf?: boolean

  /**
   * Whether to use the safe mode. The default is `false`, which is different from the other operations.
   */
  safe?: boolean

  /**
   * Determine how value objects containing a base direction are transformed to and from RDF.
   *
   * If set to `i18n-datatype`, an RDF literal is generated using a datatype IRI based on `https://www.w3.org/ns/i18n#`
   * with both the language tag (if present) and base direction encoded. When transforming from RDF, this datatype is
   * decoded to create a value object containing `@language` (if present) and `@direction`.
   * If set to `compound-literal`, a blank node is emitted instead of a literal, where the blank node is the subject of
   * `rdf:value`, `rdf:direction`, and `rdf:language` (if present) properties. When transforming from RDF, this object
   * is decoded to create a value object containing `@language` (if present), and `@direction`.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-rdfdirection
   */
  rdfDirection?: string | null
}

/**
 * Options for canonizing a RDF dataset.
 */
export interface Canonize {
  /**
   * The canonicalization algorithm to use, defaults to 'RDFC-1.0'.
   */
  algorithm: string

  /**
   * A factory function for creating a `MessageDigest` interface that overrides the built-in message digest
   * implementation used by the canonize algorithm.
   *
   * Note that using a hash (or HMAC) algorithm that differs from the one specified by the canonicalization algorithm
   * will result in different output.
   */
  createMessageDigest?: unknown
  // TODO: This is a function, but we don't know the signature.

  /**
   * The message digest algorithm used by the default implementation of `createMessageDigest`, defaults to 'sha256'.
   *
   * Supported algorithms are "sha256", "sha384", "sha512", and the "SHA###" and "SHA-###" variations.
   */
  messageDigestAlgorithm?: string

  /**
   * An optional map to be populated by the canonical identifier issuer with the bnode identifier mapping generated by
   * the canonicalization algorithm.
   */
  canonicalIdMap?: Map<string, string>

  /**
   * The format of the input. Use `application/n-quads` for a N-Quads string that will be parsed. Omit or falsy for a
   * JSON dataset.
   */
  inputFormat?: string

  /**
   * The format of the output. Omit or use `application/n-quads` for a N-Quads string.
   */
  format?: string

  /**
   * Use native implementation. Defaults to `false`.
   */
  useNative?: boolean

  /**
   * Control of the maximum number of times to run deep comparison algorithm (such as the N-Degree Hash Quads algorithm
   * used in RDFC-1.0) before bailing out and throwing an error.
   *
   * This is a useful setting for preventing wasted CPU cycles or DoS attacks when canonizing meaningless or potentially
   * malicious datasets. This parameter sets the maximum number of iterations based on the number of non-unique blank
   * nodes.
   *
   * - `0` to disable iterations,
   * - `1` for a O(n) limit,
   * - `2` for a O(n^2) limit,
   * - `3` and higher may handle "poison" graphs but may take significant computational resources, and
   * - `Infinity` for no limitation.
   *
   * Defaults to `1` which can handle many common input cases.
   */
  maxWorkFactor?: number

  /**
   * The maximum number of times to run deep comparison algorithms (such as the N-Degree Hash Quads algorithm used in
   * RDFC-1.0) before bailing out and throwing an error.
   *
   * This is a useful setting for preventing wasted CPU cycles or DoS attacks when canonizing meaningless or potentially
   * malicious datasets.
   *
   * If set to a value other than `-1`, it will explicitly set the number of iterations and override `maxWorkFactor`. It
   * is recommended to use `maxWorkFactor` instead of this option.
   */
  maxDeepIterations?: number

  /**
   * An abort signal to abort the operation. The aborted status is only periodically checked for performance reasons.
   */
  signal?: AbortSignal

  /**
   * Reject the "URDNA2015" algorithm name instead of treating it as an alias for "RDFC-1.0".
   */
  rejectURDNA2015?: boolean
}
