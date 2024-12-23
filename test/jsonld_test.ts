import * as jsonld from "jsonld"
import { loader } from "./loader.ts"
import { canonize, expandVerificationMethod } from "../src/utils/jsonld.ts"

const ld = jsonld.default

Deno.test("jsonld compacting", async () => {
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

Deno.test("jsonld canonization", async () => {
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

Deno.test("jsonld framing an element", async () => {
  const method = "did:example:489398593#test"
  const framed = await expandVerificationMethod(method, loader)
  console.log(framed)
})
