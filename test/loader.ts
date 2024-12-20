import { extend } from "../src/loader/extend.ts"
import type { NodeObject } from "../src/types/jsonld/node.ts"

import * as controller from "../data/test/controller.json" with { type: "json" }
import * as keypair from "../data/test/keypair.json" with { type: "json" }

const customLoader = (url: string) => {
  const document = new Map<string, NodeObject>([
    ["did:example:489398593#test", keypair.default],
    ["did:example:489398593", controller.default],
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
