import { defaultLoader } from "../src/utils/loader.ts"
import type { PlainDocument } from "../src/mod.ts"
import type { VerificationMethodRef } from "../src/types/did/method.ts"

Deno.test("multi-type array", () => {
  const id = "did:example:489398593#test"
  const id2 = {
    id: "did:example:489398593#test",
    controller: "did:example:489398593",
    type: "Ed25519VerificationKey2018",
  }

  const array: Array<VerificationMethodRef> = [id, id2]

  console.log(array)
})

Deno.test("fetch url", async () => {
  const url = "https://www.w3.org/ns/did/v1"
  const document = await defaultLoader(url)

  const content = document.document! as PlainDocument
  console.log(content)
})
