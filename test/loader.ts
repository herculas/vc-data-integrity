import { extend } from "../src/loader/extend.ts"
import type { PlainDocument } from "../src/types/jsonld/document.ts"
import type { Loader } from "../src/types/interface/loader.ts"

import * as controller from "../data/test/controller.json" with { type: "json" }
import * as keypair from "../data/test/keypair.json" with { type: "json" }

const customLoader: Loader = (url: string) => {
  const document = new Map<string, PlainDocument>([
    ["did:example:1145141919810#test", keypair.default],
    ["did:example:1145141919810", controller.default],
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

export const loader = extend(customLoader)
