import { ProcessingError, ProcessingErrorCode } from "../../src/error/process.ts"
import { extend } from "../../src/utils/loader.ts"

import type { JsonLdDocument } from "../../src/types/jsonld/base.ts"

import * as CID_FILE from "./cid.json" with { type: "json" }

export const testLoader = extend((url: string) => {
  const document = new Map<string, JsonLdDocument>([
    ["did:example:1145141919810", CID_FILE.default],
  ])

  if (document.has(url)) {
    const context = document.get(url)!
    return Promise.resolve({
      document: context,
      documentUrl: url,
    })
  }

  throw new ProcessingError(
    ProcessingErrorCode.INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID,
    "test#loader#custom",
    `Attempted to remote load context : '${url}', please cache instead`,
  )
})
