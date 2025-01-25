import { extendLoader } from "../src/utils/loader.ts"
import type { PlainDocument } from "../src/types/jsonld/document.ts"
import type { Loader } from "../src/types/interface/loader.ts"

import * as CONTROLLER_FILE from "../data/test/controller.json" with { type: "json" }
import * as KEYPAIR_FILE from "../data/test/keypair.json" with { type: "json" }

const customLoader: Loader = (url: string) => {
  const document = new Map<string, PlainDocument>([
    ["did:example:1145141919810#test", KEYPAIR_FILE.default],
    ["did:example:1145141919810", CONTROLLER_FILE.default],
  ])

  if (document.has(url)) {
    const context = document.get(url)!
    return Promise.resolve({
      document: context,
      documentUrl: url,
    })
  }
  throw new Error(
    `Attempted to remote load context : '${url}', please cache instead`,
  )
}

export const loader = extendLoader(customLoader)
