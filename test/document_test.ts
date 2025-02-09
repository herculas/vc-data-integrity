import { assert, assertExists } from "@std/assert"

import { resolveFragment, retrieveVerificationMethod } from "../src/utils/document.ts"
import { testLoader } from "./mock/loader.ts"
import { validateContext } from "../src/utils/document.ts"

import type { CIDDocument } from "../src/types/data/cid.ts"
import type { Credential } from "../src/types/data/credential.ts"
import type { JsonLdDocument } from "../src/types/jsonld/base.ts"

Deno.test("retrieve verification method: key 1 for authentication only", async () => {
  const methodWithRelationship = await retrieveVerificationMethod(
    "did:example:1145141919810#key-1",
    new Set(["authentication"]),
    { documentLoader: testLoader },
  )

  const methodWithoutRelationship = await retrieveVerificationMethod(
    "did:example:1145141919810#key-1",
    new Set(),
    { documentLoader: testLoader },
  )

  assertExists(methodWithRelationship)
  assertExists(methodWithoutRelationship)
})

Deno.test("retrieve verification method: key 2 for assertion, capability delegation and invocation", async () => {
  const methodWithRelationshipFull = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    new Set(["assertionMethod", "capabilityDelegation", "capabilityInvocation"]),
    { documentLoader: testLoader },
  )

  const methodWithRelationshipPartial1 = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    new Set(["assertionMethod", "capabilityDelegation"]),
    { documentLoader: testLoader },
  )

  const methodWithRelationshipPartial2 = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    new Set(["assertionMethod", "capabilityInvocation"]),
    { documentLoader: testLoader },
  )

  const methodWithRelationshipPartial3 = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    new Set(["capabilityDelegation", "capabilityInvocation"]),
    { documentLoader: testLoader },
  )

  const methodWithoutRelationship = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    new Set(),
    { documentLoader: testLoader },
  )

  assertExists(methodWithRelationshipFull)
  assertExists(methodWithRelationshipPartial1)
  assertExists(methodWithRelationshipPartial2)
  assertExists(methodWithRelationshipPartial3)

  assertExists(methodWithoutRelationship)
})

Deno.test("retrieve verification method: key 3 for assertion only", async () => {
  const methodWithRelationship = await retrieveVerificationMethod(
    "did:example:1145141919810#key-3",
    new Set(["assertionMethod"]),
    { documentLoader: testLoader },
  )

  const methodWithoutRelationship = await retrieveVerificationMethod(
    "did:example:1145141919810#key-3",
    new Set(),
    { documentLoader: testLoader },
  )

  assertExists(methodWithRelationship)
  assertExists(methodWithoutRelationship)
})

Deno.test("resolve fragments", () => {
  const doc: CIDDocument = {
    "@context": "https://www.w3.org/ns/cid/v1",
    "id": "did:example:1145141919810",
    "verificationMethod": [{
      "id": "did:example:1145141919810#key-1",
      "type": "Multikey",
      "controller": "did:example:1145141919810",
      "publicKeyMultibase": "zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv",
    }, {
      "id": "did:example:1145141919810#key-2",
      "type": "Multikey",
      "controller": "did:example:1145141919810",
      "publicKeyMultibase": "z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
    }, {
      "id": "did:example:1145141919810#key-3",
      "type": "Multikey",
      "controller": "did:example:1145141919810",
      "publicKeyMultibase": "zUC7EK3Zakmukmv3FmkmS36E4KsagJu3HDbjQ8h5ypoHjwBb",
    }],
    "authentication": [],
    "assertionMethod": [],
    "capabilityDelegation": [
      "did:example:1145141919810#key-2",
    ],
    "capabilityInvocation": [
      "did:example:1145141919810#key-2",
    ],
  }

  const resolved1 = resolveFragment(doc, "#key-1")
  const resolved2 = resolveFragment(doc, "#key-2")
  const resolved3 = resolveFragment(doc, "#key-3")
  const resolved4 = resolveFragment(doc, "#key-4")

  assertExists(resolved1)
  assertExists(resolved2)
  assertExists(resolved3)

  assert(!resolved4)
})

Deno.test("validate contexts: simple context string array", async () => {
  const cred: Credential = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2",
    ],
    "id": "http://university.example/credentials/58473",
    "type": ["VerifiableCredential", "ExampleAlumniCredential"],
    "issuer": "did:example:2g55q912ec3476eba2l9812",
    "validFrom": "2010-01-01T00:00:00Z",
    "credentialSubject": {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "alumniOf": {
        "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
        "name": "Example University",
      },
    },
  }

  const knownContext1 = ["https://www.w3.org/ns/credentials/v2", "https://www.w3.org/ns/credentials/examples/v2"]
  const knownContext2 = ["https://www.w3.org/ns/credentials/examples/v2", "https://www.w3.org/ns/credentials/v2"]
  const knownContext3 = ["https://www.w3.org/ns/credentials/v2"]
  const knownContext4 = [] as string[]

  const res1 = await validateContext(cred, knownContext1, false, testLoader)
  const res2 = await validateContext(cred, knownContext2, false, testLoader)
  const res3 = await validateContext(cred, knownContext3, false, testLoader)
  const res4 = await validateContext(cred, knownContext4, false, testLoader)

  assert(res1.validated)
  assert(res2.validated)
  assert(!res3.validated)
  assert(!res4.validated)
})

Deno.test("validate contexts: complicated nested objects", async () => {
  const doc: JsonLdDocument = {
    "@context": [
      {
        "myWebsite": "https://vocabulary.example/myWebsite",
        "proof": "https://w3id.org/security#proof",
        "DataIntegrityProof": "https://w3id.org/security/data-integrity#DataIntegrityProof",
        "cryptosuite": "https://w3id.org/security#cryptosuite",
        "created": {
          "@id": "https://purl.org/dc/terms/created",
          "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        },
      },
      "https://w3id.org/security/data-integrity/v2",
    ],
    "myWebsite": "https://hello.world.example/",
    "proof": {
      "type": "DataIntegrityProof",
      "cryptosuite": "ecdsa-rdfc-2019",
      "created": "2020-06-11T19:14:04Z",
      "verificationMethod": "https://ldi.example/issuer#zDnaepBuvsQ8cpsWrVKw8fbpGpvPeNSjVPTWoq6cRqaYzBKVP",
      "proofPurpose": "assertionMethod",
      "proofValue": "zXb23ZkdakfJNUhiTEdwyE598X7RLrkjnXEADLQZ7vZyUGXX8cyJZRBkNw813SGsJHWrcpo4Y8hRJ7adYn35Eetq",
    },
  }

  const knownContext1 = [
    {
      "myWebsite": "https://vocabulary.example/myWebsite",
      "proof": "https://w3id.org/security#proof",
      "DataIntegrityProof": "https://w3id.org/security/data-integrity#DataIntegrityProof",
      "cryptosuite": "https://w3id.org/security#cryptosuite",
      "created": {
        "@id": "https://purl.org/dc/terms/created",
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
      },
    },
    "https://w3id.org/security/data-integrity/v2",
  ]
  const knownContext2 = [
    "https://w3id.org/security/data-integrity/v2",
    {
      "DataIntegrityProof": "https://w3id.org/security/data-integrity#DataIntegrityProof",
      "cryptosuite": "https://w3id.org/security#cryptosuite",
      "myWebsite": "https://vocabulary.example/myWebsite",
      "created": {
        "@id": "https://purl.org/dc/terms/created",
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
      },
      "proof": "https://w3id.org/security#proof",
    },
  ]
  const knownContext3 = ["https://w3id.org/security/data-integrity/v2"]
  const knownContext4 = "https://w3id.org/security/data-integrity/v2"

  const res1 = await validateContext(doc, knownContext1, false, testLoader)
  const res2 = await validateContext(doc, knownContext2, false, testLoader)
  const res3 = await validateContext(doc, knownContext3, false, testLoader)
  const res4 = await validateContext(doc, knownContext4, false, testLoader)

  assert(res1.validated)
  assert(res2.validated)
  assert(!res3.validated)
  assert(!res4.validated)
})
