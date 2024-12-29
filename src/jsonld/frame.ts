import * as jsonld from "jsonld"

import type { DIDURL } from "../types/did/keywords.ts"
import type { FrameOptions } from "../types/interface/jsonld.ts"
import type { Frame, PlainDocument } from "../types/jsonld/document.ts"

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
