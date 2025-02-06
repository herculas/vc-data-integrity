import type { Loader } from "../src/types/api/loader.ts"
import type { JsonLdDocument } from "../src/types/jsonld/base.ts"
import { extendLoader } from "../src/utils/loader.ts"

import * as CONTROLLER_FILE from "./mock/controller.json" with { type: "json" }
import * as KEYPAIR_FILE from "./mock/keypair.json" with { type: "json" }

const customLoader: Loader = (url: string) => {
  const document = new Map<string, JsonLdDocument>([
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

  // TODO: error handling
  throw new Error(
    `Attempted to remote load context : '${url}', please cache instead`,
  )
}

export const loader = extendLoader(customLoader)
