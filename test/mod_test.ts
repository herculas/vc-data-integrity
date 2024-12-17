import * as jsonld from "jsonld"
import { canonize, sha256 } from "../src/util.ts"
import { extend } from "../src/loader.ts"
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

Deno.test("extend", async () => {
  const input = {
    "@context": "https://w3id.org/security/v2",
    "type": "sec:BbsBlsSignature2020",
    "created": "2024-12-16T12:05:38Z",
    "verificationMethod": "did:example:489398593#test",
    "proofPurpose": "assertionMethod",
  }
  const customLoader = (url: string) => {
    return Promise.resolve({
      documentUrl: url,
    })
  }
  const loader = extend(customLoader)
  const options = {
    loader: loader,
    skipExpansion: false,
    expansionMap: undefined,
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
