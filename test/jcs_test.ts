import * as jcs from "../src/serialize/jcs.ts"

import type { JsonLdDocument } from "../src/types/jsonld/document.ts"

Deno.test("JSON canonicalization: basic 1", () => {
  const expandedDocument: JsonLdDocument = [
    {
      "@id": "http://me.markus-lanthaler.com/",
      "http://xmlns.com/foaf/0.1/name": [
        {
          "@value": "Markus Lanthaler",
        },
      ],
      "http://xmlns.com/foaf/0.1/homepage": [
        {
          "@id": "http://www.markus-lanthaler.com/",
        },
      ],
    },
  ] as const

  const canonized = jcs.canonize(expandedDocument)
  console.log(canonized)
})

Deno.test("JSON canonicalization: basic 2", () => {
  const expandedDocument: JsonLdDocument = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2",
    ],
    "id": "urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33",
    "type": ["VerifiableCredential", "AlumniCredential"],
    "name": "Alumni Credential",
    "description": "A minimum viable example of an Alumni Credential.",
    "issuer": "https://vc.example/issuers/5678",
    "validFrom": "2023-01-01T00:00:00Z",
    "credentialSubject": {
      "id": "did:example:abcdefgh",
      "alumniOf": "The School of Examples",
    },
  } as const

  const canonized = jcs.canonize(expandedDocument)
  console.log(canonized)
})

Deno.test("JSON canonicalization: basic 3", () => {
  const expandedDocument: JsonLdDocument = {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-jcs-2022",
    "created": "2023-02-24T23:36:38Z",
    "verificationMethod":
      "did:key:z6MkrJVnaZkeFzdQyMZu1cgjg7k1pZZ6pvBQ7XJPt4swbTQ2#z6MkrJVnaZkeFzdQyMZu1cgjg7k1pZZ6pvBQ7XJPt4swbTQ2",
    "proofPurpose": "assertionMethod",
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2",
    ],
  } as const

  const canonized = jcs.canonize(expandedDocument)
  console.log(canonized)
})
