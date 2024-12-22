import type { VerificationMethod } from "../src/types/did/method.ts"

Deno.test("multi-type array", () => {
  const id = "did:example:489398593#test"
  const id2 = {
    id: "did:example:489398593#test",
    controller: "did:example:489398593",
    type: "Ed25519VerificationKey2018",
  }

  const array: Array<VerificationMethod> = [id, id2]

  console.log(array)
})
