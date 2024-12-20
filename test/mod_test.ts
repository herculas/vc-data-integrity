import * as controller from "../data/test/controller.json" with { type: "json" }
import * as jsonld from "jsonld"
import * as keypair from "../data/test/keypair.json" with { type: "json" }
import { extend } from "../src/loader/extend.ts"
import { sha256 } from "../src/utils/crypto.ts"
import { canonize, expandMethod } from "../src/utils/jsonld.ts"
import type { NodeObject } from "../src/types/jsonld/node.ts"
import type { MethodMap } from "../src/types/did/method.ts"

const ld = jsonld.default

Deno.test("jsonld", async () => {
  const doc = {
    "http://schema.org/name": "Manu Sporny",
    "http://schema.org/url": { "@id": "http://manu.sporny.org/" },
    "http://schema.org/image": { "@id": "http://manu.sporny.org/images/manu.png" },
  }
  const context = {
    "name": "http://schema.org/name",
    "homepage": { "@id": "http://schema.org/url", "@type": "@id" },
    "image": { "@id": "http://schema.org/image", "@type": "@id" },
  }
  const compacted = await ld.compact(doc, context)
  console.log(JSON.stringify(compacted, null, 2))
})

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

const loader = extend(customLoader)

Deno.test("extend", async () => {
  const input = {
    "@context": "https://w3id.org/security/v2",
    "type": "sec:BbsBlsSignature2020",
    "created": "2024-12-16T12:05:38Z",
    "verificationMethod": "did:example:489398593#test",
    "proofPurpose": "assertionMethod",
  }
  const options = {
    documentLoader: loader,
    skipExpansion: false,
    algorithm: "URDNA2015",
    format: "application/n-quads",
  }
  const result = await canonize(input, options)
  console.log(result)
  console.log(typeof result)
})

Deno.test("hash", async () => {
  const str = "hello"
  const hash = await sha256(str)
  console.log(hash)
})

Deno.test("frame", async () => {
  const method = "did:example:489398593#test"
  const framed = await expandMethod(method, loader)
  console.log(framed)
})

Deno.test("multi-type array", () => {
  const id = "did:example:489398593#test"
  const id2 = {
    id: "did:example:489398593#test",
    controller: "did:example:489398593",
    type: "Ed25519VerificationKey2018",
  }

  const array: Array<MethodMap> = [id, id2]

  console.log(array)
})