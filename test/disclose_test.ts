import { assertEquals } from "@std/assert"

import { canonize } from "../src/serialize/rdfc.ts"
import {
  createHmacIdLabelMapFunction,
  createLabelMapFunction,
  createShuffledIdLabelMapFunction,
  labelReplacementCanonicalizeJsonLd,
  labelReplacementCanonicalizeNQuads,
} from "../src/disclose/canonize.ts"
import { selectCanonicalNQuads, selectJsonLd } from "../src/disclose/select.ts"
import { skolemizeCompactJsonLd, toDeskolemizedNQuads } from "../src/disclose/skolemize.ts"
import { testLoader } from "./mock/loader.ts"

import type { Credential } from "../src/types/data/credential.ts"
import type { HMAC, LabelMap } from "../src/types/api/disclose.ts"
import type { JsonValue } from "../src/types/serialize/document.ts"
import { canonicalizeAndGroup } from "../src/disclose/group.ts"

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

  const labelFactoryFunc = createHmacIdLabelMapFunction(hmac)
  const result = await labelReplacementCanonicalizeJsonLd(credential, labelFactoryFunc, { documentLoader: testLoader })

  const expected = [
    "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:AlumniCredential> .\n",
    "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> .\n",
    '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
    "<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n",
    '<urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> <https://schema.org#alumniOf> "Example University" .\n',
  ]

  assertEquals(result.canonicalNQuads, expected)
})

Deno.test("HMAC ID canonized: with labelMap, with blank nodes", async () => {
  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const labelMap: LabelMap = new Map([
    ["c14n0", "c14n0_new"],
    ["c14n1", "c14n2_new"],
    ["c14n2", "c14n3_new"],
  ])

  const labelFactoryFunc = createLabelMapFunction(labelMap)
  const result = await labelReplacementCanonicalizeJsonLd(credential, labelFactoryFunc, { documentLoader: testLoader })

  const expected = [
    "_:c14n0_new <urn:example:driverLicense> _:c14n2_new .\n",
    "_:c14n2_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:c14n2_new <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:c14n2_new <urn:example:documentIdentifier> "T21387yc328c7y32h23f23" .\n',
    '_:c14n2_new <urn:example:expiration> "01-01-2030" .\n',
    '_:c14n2_new <urn:example:issuingAuthority> "VA" .\n',
    "_:c14n3_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:c14n3_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:c14n3_new <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0_new .\n",
    '_:c14n3_new <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
    "_:c14n3_new <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n",
  ]

  assertEquals(result.canonicalNQuads, expected)
})

Deno.test("HMAC ID canonized: with HMAC, with blank nodes", async () => {
  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

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

  const labelFactoryFunc = createHmacIdLabelMapFunction(hmac)
  const result = await labelReplacementCanonicalizeJsonLd(credential, labelFactoryFunc, { documentLoader: testLoader })

  const expected = [
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#credentialSubject> _:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 .\n",
    '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n",
    "_:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 <urn:example:driverLicense> _:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc .\n",
    "_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:documentIdentifier> "T21387yc328c7y32h23f23" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:expiration> "01-01-2030" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:issuingAuthority> "VA" .\n',
  ]

  assertEquals(result.canonicalNQuads, expected)
})

Deno.test("HMAC ID shuffled and canonized: with HMAC, with blank nodes", async () => {
  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

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

  const labelFactoryFunc = createShuffledIdLabelMapFunction(hmac)
  const result = await labelReplacementCanonicalizeJsonLd(credential, labelFactoryFunc, { documentLoader: testLoader })

  const expected = [
    "_:b0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:b0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:b0 <https://www.w3.org/2018/credentials#credentialSubject> _:b1 .\n",
    '_:b0 <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
    "_:b0 <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n",
    "_:b1 <urn:example:driverLicense> _:b2 .\n",
    "_:b2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:b2 <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:b2 <urn:example:documentIdentifier> "T21387yc328c7y32h23f23" .\n',
    '_:b2 <urn:example:expiration> "01-01-2030" .\n',
    '_:b2 <urn:example:issuingAuthority> "VA" .\n',
  ]

  assertEquals(result.canonicalNQuads, expected)
})

Deno.test("HMAC ID canonized: with HMAC, with blank nodes, skolemized", async () => {
  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

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
  const labelFactoryFunc = createHmacIdLabelMapFunction(hmac)

  const skolemized = await skolemizeCompactJsonLd(credential, undefined, undefined, { documentLoader: testLoader })
  const deskolemized = await toDeskolemizedNQuads(skolemized.compact, undefined, { documentLoader: testLoader })
  const result = await labelReplacementCanonicalizeNQuads(deskolemized, labelFactoryFunc)

  const expected = [
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#credentialSubject> _:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 .\n",
    '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
    "_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n",
    "_:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 <urn:example:driverLicense> _:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc .\n",
    "_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:documentIdentifier> "T21387yc328c7y32h23f23" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:expiration> "01-01-2030" .\n',
    '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:issuingAuthority> "VA" .\n',
  ]

  assertEquals(result.canonicalNQuads, expected)
})

Deno.test("JSON-LD selection: simple case", () => {
  const pointers = [
    "/credentialSubject/driverLicense/dateOfBirth",
    "/credentialSubject/driverLicense/expirationDate",
  ]

  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    id: "urn:uuid:36245ee9-9074-4b05-a777-febff2e69757",
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      id: "urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440",
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const selected = selectJsonLd(pointers, credential)

  const expected: JsonValue = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    id: "urn:uuid:36245ee9-9074-4b05-a777-febff2e69757",
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    credentialSubject: {
      id: "urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440",
      driverLicense: {
        type: "DriverLicense",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
      },
    },
  }

  assertEquals(selected, expected)
})

Deno.test("JSON-LD selection: matching N pointers without identifiers", () => {
  const pointers = [
    "/credentialSubject/driverLicense/dateOfBirth",
    "/credentialSubject/driverLicense/expirationDate",
  ]

  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const selected = selectJsonLd(pointers, credential)

  const expected: JsonValue = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
      },
    },
  }

  assertEquals(selected, expected)
})

Deno.test("N-Quads selection: matching N pointers with identifiers", async () => {
  const pointers = [
    "/credentialSubject/driverLicense/dateOfBirth",
    "/credentialSubject/driverLicense/expirationDate",
  ]

  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    id: "urn:uuid:36245ee9-9074-4b05-a777-febff2e69757",
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      id: "urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440",
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const skolemized = await skolemizeCompactJsonLd(credential, undefined, undefined, { documentLoader: testLoader })
  const deskolemized = await toDeskolemizedNQuads(skolemized.compact, undefined, { documentLoader: testLoader })

  let canonicalIdMap = new Map<string, string>()
  await canonize(deskolemized.join(""), {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
    inputFormat: "application/n-quads",
    canonicalIdMap,
  })
  canonicalIdMap = new Map(
    [...canonicalIdMap].map(
      ([key, value]) => [key.replace(/^_:/, ""), value.replace(/^_:/, "")],
    ),
  )

  const selected = await selectCanonicalNQuads(
    pointers,
    skolemized.compact,
    canonicalIdMap,
    undefined,
    { documentLoader: testLoader },
  )

  const expectedNQuads = [
    "<urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440> <urn:example:driverLicense> _:c14n0 .\n",
    "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440> .\n",
    "_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:c14n0 <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:c14n0 <urn:example:expiration> "01-01-2030" .\n',
  ]

  assertEquals(
    selected.nQuads.toSorted(),
    expectedNQuads.toSorted(),
  )
})

Deno.test("N-Quads selection: matching N pointers without identifiers", async () => {
  const pointers = [
    "/credentialSubject/driverLicense/dateOfBirth",
    "/credentialSubject/driverLicense/expirationDate",
  ]

  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const skolemized = await skolemizeCompactJsonLd(credential, undefined, undefined, { documentLoader: testLoader })
  const deskolemized = await toDeskolemizedNQuads(skolemized.compact, undefined, { documentLoader: testLoader })

  let canonicalIdMap = new Map<string, string>()
  await canonize(deskolemized.join(""), {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
    inputFormat: "application/n-quads",
    canonicalIdMap,
  })
  canonicalIdMap = new Map(
    [...canonicalIdMap].map(
      ([key, value]) => [key.replace(/^_:/, ""), value.replace(/^_:/, "")],
    ),
  )

  const selected = await selectCanonicalNQuads(
    pointers,
    skolemized.compact,
    canonicalIdMap,
    undefined,
    { documentLoader: testLoader },
  )

  const expected = [
    "_:c14n0 <urn:example:driverLicense> _:c14n1 .\n",
    "_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:c14n1 <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:c14n1 <urn:example:expiration> "01-01-2030" .\n',
    "_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:c14n2 <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0 .\n",
  ]

  assertEquals(
    selected.nQuads.toSorted(),
    expected.toSorted(),
  )
})

Deno.test("N-Quads selection: matching N pointers with blank node identifiers", async () => {
  const pointers = [
    "/credentialSubject/driverLicense/id",
    "/credentialSubject/driverLicense/dateOfBirth",
    "/credentialSubject/driverLicense/expirationDate",
  ]

  const credential: Credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "@protected": true,
        DriverLicenseCredential: "urn:example:DriverLicenseCredential",
        DriverLicense: {
          "@id": "urn:example:DriverLicense",
          "@context": {
            "@protected": true,
            id: "@id",
            type: "@type",
            documentIdentifier: "urn:example:documentIdentifier",
            dateOfBirth: "urn:example:dateOfBirth",
            expirationDate: "urn:example:expiration",
            issuingAuthority: "urn:example:issuingAuthority",
          },
        },
        driverLicense: {
          "@id": "urn:example:driverLicense",
          "@type": "@id",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    type: ["VerifiableCredential", "DriverLicenseCredential"],
    issuer: "did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      driverLicense: {
        id: "_:b123",
        type: "DriverLicense",
        documentIdentifier: "T21387yc328c7y32h23f23",
        dateOfBirth: "01-01-1990",
        expirationDate: "01-01-2030",
        issuingAuthority: "VA",
      },
    },
  }

  const skolemized = await skolemizeCompactJsonLd(credential, undefined, undefined, { documentLoader: testLoader })
  const deskolemized = await toDeskolemizedNQuads(skolemized.compact, undefined, { documentLoader: testLoader })

  let canonicalIdMap = new Map<string, string>()
  await canonize(deskolemized.join(""), {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
    inputFormat: "application/n-quads",
    canonicalIdMap,
  })
  canonicalIdMap = new Map(
    [...canonicalIdMap].map(
      ([key, value]) => [key.replace(/^_:/, ""), value.replace(/^_:/, "")],
    ),
  )

  const selected = await selectCanonicalNQuads(
    pointers,
    skolemized.compact,
    canonicalIdMap,
    undefined,
    { documentLoader: testLoader },
  )

  const expected = [
    "_:c14n0 <urn:example:driverLicense> _:c14n1 .\n",
    "_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
    '_:c14n1 <urn:example:dateOfBirth> "01-01-1990" .\n',
    '_:c14n1 <urn:example:expiration> "01-01-2030" .\n',
    "_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
    "_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
    "_:c14n2 <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0 .\n",
  ]

  assertEquals(
    selected.nQuads.toSorted(),
    expected.toSorted(),
  )
})

Deno.test("Canonize and group", async () => {
  const unsecuredDocument: Credential = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://w3id.org/citizenship/v4rc1",
    ],
    type: [
      "VerifiableCredential",
      "EmploymentAuthorizationDocumentCredential",
    ],
    issuer: {
      id: "did:key:zDnaegE6RR3atJtHKwTRTWHsJ3kNHqFwv7n9YjTgmU7TyfU76",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgUPr/HwADaAIhG61j/AAAAABJRU5ErkJggg==",
    },
    credentialSubject: {
      type: ["Person", "EmployablePerson"],
      givenName: "JOHN",
      additionalName: "JACOB",
      familyName: "SMITH",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2Ng+M/wHwAEAQH/7yMK/gAAAABJRU5ErkJggg==",
      gender: "Male",
      residentSince: "2015-01-01",
      birthCountry: "Bahamas",
      birthDate: "1999-07-17",
      employmentAuthorizationDocument: {
        type: "EmploymentAuthorizationDocument",
        identifier: "83627465",
        lprCategory: "C09",
        lprNumber: "999-999-999",
      },
    },
    name: "Employment Authorization Document",
    description: "Example Employment Authorization Document.",
    validFrom: "2019-12-03T00:00:00Z",
    validUntil: "2029-12-03T00:00:00Z",
  }

  const groupDefinitions: Map<string, Array<string>> = new Map([["mandatory", ["/issuer"]]])

  const hmacCryptoKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign", "verify"],
  )
  const hmac: HMAC = async (data: Uint8Array) =>
    new Uint8Array(await crypto.subtle.sign(hmacCryptoKey.algorithm, hmacCryptoKey, data))
  const labelMapFactoryFunction = createHmacIdLabelMapFunction(hmac)
  const options = { documentLoader: testLoader }

  const res = await canonicalizeAndGroup(
    unsecuredDocument,
    labelMapFactoryFunction,
    groupDefinitions,
    options,
  )

  console.log(res.groups)
})
