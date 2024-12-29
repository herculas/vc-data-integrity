import { canonizeDocument, canonizeProof } from "../src/jsonld/canonize.ts"
import { loader } from "./loader.ts"
import type { VerificationMethodMap } from "../src/types/did/method.ts"

Deno.test("document canonization", async () => {
  const document = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2",
    ],
    "id": "http://university.example/credentials/3732",
    "type": ["VerifiableCredential", "ExampleDegreeCredential"],
    "issuer": {
      "id": "did:example:1145141919810",
      "name": "Example University",
      "description": "A public university focusing on teaching examples.",
    },
    "validFrom": "2015-05-10T12:30:00Z",
    "name": "Example University Degree",
    "description": "2015 Bachelor of Science and Arts Degree",
    "credentialSubject": {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "degree": {
        "type": "ExampleBachelorDegree",
        "name": "Bachelor of Science and Arts",
      },
    },
  }

  const result = await canonizeDocument(document, loader)
  console.log(result)
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
  const method = result.document! as VerificationMethodMap
  console.log(method)
})
