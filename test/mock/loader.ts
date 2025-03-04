import { ProcessingError, ProcessingErrorCode } from "../../src/error/process.ts"
import { extend } from "../../src/utils/loader.ts"

import type { JsonLdDocument } from "../../src/types/jsonld/document.ts"

import * as CID_FILE_1 from "./cid-1.json" with { type: "json" }
import * as CID_FILE_2 from "./cid-2.json" with { type: "json" }

export const testLoader = extend((url: string) => {
  const document = new Map<string, JsonLdDocument>([
    ["did:example:1145141919810", CID_FILE_1.default],
    ["did:key:z6MkrJVnaZkeFzdQyMZu1cgjg7k1pZZ6pvBQ7XJPt4swbTQ2", CID_FILE_2.default],
  ])

  if (document.has(url)) {
    return Promise.resolve({
      documentUrl: url,
      document: document.get(url)!,
    })
  }

  throw new ProcessingError(
    ProcessingErrorCode.INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID,
    "test#loader#custom",
    `Attempted to remote load context : '${url}', please cache instead`,
  )
})
