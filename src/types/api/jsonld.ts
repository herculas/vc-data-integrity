import type { ContextDefinition } from "../serialize/context.ts"
import type { LoadDocumentCallback } from "./loader.ts"

/**
 * Common options for canonizing or framing a JSON-LD document.
 */
interface Common {
  /**
   * The base IRI to use when expanding relative IRIs. This property is set to `null` by default, which means that
   * relative IRIs will not be expanded.
   */
  base?: string

  /**
   * The context to use when expanding a document.
   */
  expandContext?: ContextDefinition
}

/**
 * Options for compacting a JSON-LD document.
 */
export interface Compact extends Common {
  /**
   * Whether to compact arrays to single values when appropriate, `true` to compact arrays to single values, `false` to
   * keep values as arrays. The default is `true`.
   */
  compactArrays?: boolean

  /**
   * Whether to compact IRIs to be relative to document base, `true` to compact IRIs to be relative to document base,
   * `false` to keep absolute. The default is `true`.
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
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback

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
export interface Expand extends Common {
  /**
   * Whether to keep free-floating nodes, `true` to keep free-floating nodes, `false` to drop them. The default is
   * `false`.
   */
  keepFreeFloatingNodes?: boolean

  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback

  /**
   * Whether to use the safe mode. The default is `false`, which is different from the other operations.
   */
  safe?: boolean
}

/**
 * Options for flattening a JSON-LD document.
 */
export interface Flatten extends Common {
  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback
}

/**
 * Options for framing a JSON-LD document.
 */
export interface Frame extends Common {
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
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback

  /**
   * Whether to use the safe mode. The default is `true`.
   */
  safe?: boolean
}

/**
 * Options for canonizing a JSON-LD document.
 */
export interface Normalize extends Common {
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
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback

  /**
   * Whether to use a native canonization algorithm, if available.
   */
  useNative?: boolean

  /**
   * The indication of the direction of the graph for transformation of @direction. Can be 'i18n-datatype' or null.
   */
  rdfDirection?: string

  /**
   * Whether to use the safe mode. The default is `true`.
   */
  safe?: boolean
}

export interface ToRdf extends Common {
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
   * The default is `false`.
   */
  produceGeneralizedRdf?: boolean

  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader?: LoadDocumentCallback

  /**
   * Whether to use the safe mode. The default is `false`, which is different from the other operations.
   */
  safe?: boolean

  /**
   * Determine how value objects containing a base direction are transformed to and from RDF.
   *
   * - If set to `i18n-datatype`, an RDF literal is generated using a datatype IRI based on
   *   `https://www.w3.org/ns/i18n#` with both the language tag (if present) and base direction encoded. When
   *   transforming from RDF, this datatype is decoded to create a value object containing `@language` (if present) and
   *   `@direction`.
   * - If set to `compound-literal`, a blank node is emitted instead of a literal, where the blank node is the subject
   *   of `rdf:value`, `rdf:direction`, and `rdf:language` (if present) properties. When transforming from RDF, this
   *   object is decoded to create a value object containing `@language` (if present), and `@direction`.
   *
   * The default is `null`.
   */
  rdfDirection?: string | null
}
