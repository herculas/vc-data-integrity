import { assertExists } from "@std/assert"

import { defaultLoader } from "../src/utils/loader.ts"
import { resoluteFragment } from "../src/utils/controlled.ts"

import type { CIDDocument } from "../src/types/data/cid.ts"
import type { JsonLdDocument } from "../src/types/jsonld/base.ts"
import type { URI } from "../src/types/jsonld/literals.ts"

const controlledIdentifierDocument: CIDDocument = {
  "@context": "https://www.w3.org/ns/cid/v1",
  "id": "https://multikey.example/issuer/123",
  "verificationMethod": [{
    "id": "https://multikey.example/issuer/123#key-1",
    "type": "Multikey",
    "controller": "https://multikey.example/issuer/123",
    "publicKeyMultibase": "zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv",
  }, {
    "id": "https://multikey.example/issuer/123#key-2",
    "type": "Multikey",
    "controller": "https://multikey.example/issuer/123",
    "publicKeyMultibase": "z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
  }, {
    "id": "https://multikey.example/issuer/123#key-3",
    "type": "Multikey",
    "controller": "https://multikey.example/issuer/123",
    "publicKeyMultibase":
      "zUC7EK3ZakmukHhuncwkbySmomv3FmrkmS36E4Ks5rsb6VQSRpoCrx6Hb8e2Nk6UvJFSdyw9NK1scFXJp21gNNYFjVWNgaqyGnkyhtagagCpQb5B7tagJu3HDbjQ8h5ypoHjwBb",
  }],
  "authentication": [
    "https://multikey.example/issuer/123#key-1",
  ],
  "assertionMethod": [
    "https://multikey.example/issuer/123#key-2",
    "https://multikey.example/issuer/123#key-3",
  ],
  "capabilityDelegation": [
    "https://multikey.example/issuer/123#key-2",
  ],
  "capabilityInvocation": [
    "https://multikey.example/issuer/123#key-2",
  ],
} as const

// TODO: test data reorganization

Deno.test("document loader", async () => {
  const url = controlledIdentifierDocument["@context"] as URI
  const document = await defaultLoader(url)
  const content = document.document! as JsonLdDocument
  assertExists(content)
})

Deno.test("recursive fragment resolution", () => {
  const identifier1 = "#key-1"
  const identifier2 = "#key-2"
  const identifier3 = "#key-3"

  const result1 = resoluteFragment(controlledIdentifierDocument, identifier1)
  const result2 = resoluteFragment(controlledIdentifierDocument, identifier2)
  const result3 = resoluteFragment(controlledIdentifierDocument, identifier3)

  assertExists(result1)
  assertExists(result2)
  assertExists(result3)
})
