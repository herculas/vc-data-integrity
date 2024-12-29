import type { Context } from "../jsonld/keywords.ts"
import type { Loader } from "./loader.ts"

interface Common {
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

interface Canonize extends Common {
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

interface Frame extends Common {
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

export type { Canonize as CanonizeOptions, Frame as FrameOptions }
