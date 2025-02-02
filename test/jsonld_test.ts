import { canonizeDocument, canonizeProof } from "../src/utils/jsonld.ts"
import { loader } from "./loader.ts"
import type { VerificationMethod } from "../src/types/did/method.ts"

Deno.test("document canonization", async () => {
  const document = {
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
  }

  const result = await canonizeDocument(document, loader)
  console.log(result)

  const expected =
    `<did:example:abcdefgh> <https://www.w3.org/ns/credentials/examples#alumniOf> "The School of Examples" .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/ns/credentials/examples#AlumniCredential> .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <https://schema.org/description> "A minimum viable example of an Alumni Credential." .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <https://schema.org/name> "Alumni Credential" .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <https://www.w3.org/2018/credentials#credentialSubject> <did:example:abcdefgh> .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <https://www.w3.org/2018/credentials#issuer> <https://vc.example/issuers/5678> .
<urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33> <https://www.w3.org/2018/credentials#validFrom> "2023-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`

  console.log(expected)
})

Deno.test("proof canonization", async () => {
  const proof = {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "created": "2021-11-13T18:19:39Z",
    "verificationMethod": "did:example:1145141919810#test",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpjQCrfFPP2oumHKtz",
  }

  const result = await canonizeProof(proof, loader)
  console.log(result)
})

Deno.test("expand verification method", async () => {
  const methodId = "did:example:1145141919810#test"
  const result = await loader(methodId)
  const method = result.document! as VerificationMethod
  console.log(method)
})
