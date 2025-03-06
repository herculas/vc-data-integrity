import * as jsonld from "../src/serialize/jsonld.ts"
import * as rdf from "../src/serialize/rdf.ts"

import { testLoader } from "./mock/loader.ts"
import { createHmacIdLabelMapFunction, labelReplacementCanonicalizeJsonLd } from "../src/disclose/canonize.ts"

import type { Credential } from "../src/types/data/credential.ts"
import type { HMAC } from "../src/types/api/disclose.ts"

Deno.test("Replace label of canonicalized JSON-LD", async () => {
  const rawHmacKey = new Uint8Array(32)
  rawHmacKey[0] = 1
  rawHmacKey[31] = 1
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    rawHmacKey,
    { name: "HMAC", hash: { name: "SHA-256" } },
    true,
    ["sign", "verify"],
  )

  const hmac: HMAC = async (data: Uint8Array) => {
    const res = await crypto.subtle.sign(hmacKey.algorithm, hmacKey, data)
    return new Uint8Array(res)
  }

  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        AlumniCredential: "urn:example:AlumniCredential",
        alumniOf: "https://schema.org#alumniOf",
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    id: "urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0",
    type: ["VerifiableCredential", "AlumniCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      id: "urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2",
      alumniOf: "Example University",
    },
  }

  const labelMapFactoryFunction = createHmacIdLabelMapFunction(hmac)
  const result = await labelReplacementCanonicalizeJsonLd(
    credential,
    labelMapFactoryFunction,
    { documentLoader: testLoader },
  )

  console.log(result)

  // [
  //   "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .",
  //   "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:AlumniCredential> .",
  //   "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> .",
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .',
  //   "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .",
  //   '<urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> <https://schema.org#alumniOf> "Example University" .'
  // ]

  // [
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:AlumniCredential> .\n',
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> .\n',
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
  //   '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n',
  //   '<urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> <https://schema.org#alumniOf> "Example University" .\n'
  // ]
})
