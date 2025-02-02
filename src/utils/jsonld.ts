import * as jsonld from "jsonld"
import type { Context } from "../types/jsonld/keywords.ts"
import type { DIDURL } from "../types/jsonld/literals.ts"
import type { Frame, PlainDocument } from "../types/jsonld/document.ts"
import type { Loader } from "./loader.ts"

/**
 * Perform the RDF dataset canonicalization on the specified input, which should be a JSON-LD document unless the
 * `inputFormat` field is specified in the options. The output should be an RDF dataset unless the `format` field is
 * specified in the options.
 *
 * The canonization process sets `safe` to `true` and `base` to `null` by default, in order to produce safe outputs
 * and "fail closed".
 *
 * @param {PlainDocument} input The document to canonize.
 * @param {CanonizeOptions} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized object.
 */
export async function canonize(input: PlainDocument, options: CanonizeOptions): Promise<string> {
  return await jsonld.default.canonize(input, options)
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

/**
 * Common options for canonizing or framing a JSON-LD document.
 */
interface CommonOptions {
  /**
   * The base IRI to use when expanding relative IRIs. This property is set to `null` by default, which means that
   * relative IRIs will not be expanded.
   */
  base?: string

  /**
   * The context to use when expanding a document.
   */
  expandContext?: Context
}

/**
 * Options for canonizing a JSON-LD document.
 */
interface CanonizeOptions extends CommonOptions {
  /**
   * The canonization algorithm to be used, either 'URDNA2015' or 'URGNA2012'. The default is 'URDNA2015'.
   */
  algorithm?: string

  /**
   * Whether to skip expansion when serializing, `true` to assume the input is expanded and skip the expansion step,
   * `false` to expand the input before serializing. The default is `false`.
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
  documentLoader?: Loader

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

/**
 * Options for framing a JSON-LD document.
 */
interface FrameOptions extends CommonOptions {
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
  documentLoader?: Loader

  /**
   * Whether to use the safe mode. The default is `true`.
   */
  safe?: boolean
}
