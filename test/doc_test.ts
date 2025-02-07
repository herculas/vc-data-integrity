import { assertExists } from "@std/assert"

import { retrieveVerificationMethod } from "../src/utils/document.ts"
import { testLoader } from "./mock/loader.ts"

Deno.test("retrieve verification method", async () => {
  const vm1_auth = await retrieveVerificationMethod(
    "did:example:1145141919810#key-1",
    "authentication",
    { documentLoader: testLoader },
  )

  const vm2_ast = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    "assertionMethod",
    { documentLoader: testLoader },
  )

  const vm2_del = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    "capabilityDelegation",
    { documentLoader: testLoader },
  )

  const vm2_inv = await retrieveVerificationMethod(
    "did:example:1145141919810#key-2",
    "capabilityInvocation",
    { documentLoader: testLoader },
  )

  const vm3_ast = await retrieveVerificationMethod(
    "did:example:1145141919810#key-3",
    "assertionMethod",
    { documentLoader: testLoader },
  )

  assertExists(vm1_auth)
  assertExists(vm2_ast)
  assertExists(vm2_del)
  assertExists(vm2_inv)
  assertExists(vm3_ast)

  console.log(vm1_auth)
  console.log(vm2_ast)
  console.log(vm3_ast)
})
