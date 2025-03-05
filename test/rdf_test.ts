import { assertEquals, assertStrictEquals } from "@std/assert"

import * as rdf from "../src/serialize/rdf.ts"

Deno.test("Simple input", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
  })

  assertStrictEquals(output, expected)
})

Deno.test("Falsy output", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
  })

  assertStrictEquals(output, expected)
})

Deno.test("Canonical Id Map", async () => {
  const input = `_:b0 <urn:p0> _:b1 .\n_:b1 <urn:p1> "v1" .`
  const expected = `_:c14n0 <urn:p0> _:c14n1 .\n_:c14n1 <urn:p1> "v1" .`

  const expectedMap = new Map([
    ["b0", "c14n0"],
    ["b1", "c14n1"],
  ])

  const canonicalIdMap = new Map<string, string>()

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    canonicalIdMap,
  })

  console.log(expected)
  console.log(output)

  assertEquals(canonicalIdMap, expectedMap)
})
