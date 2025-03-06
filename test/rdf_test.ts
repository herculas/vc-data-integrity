import { assertEquals, assertExists, assertMatch, assertStrictEquals } from "@std/assert"

import * as rdf from "../src/serialize/rdf.ts"

import type { RdfDataset } from "../src/types/serialize/rdf.ts"

Deno.test("Invalid algorithm", async () => {
  const input: Array<string> = []
  const algorithm = "INVALID"

  try {
    await rdf.canonize(input, {
      algorithm,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Invalid RDF Dataset Canonicalization algorithm: ${algorithm}`)
  }
})

Deno.test("Invalid input format", async () => {
  const input = ""
  const inputFormat = "application/invalid"

  try {
    await rdf.canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unknown canonicalization input format: "${inputFormat}".`)
  }
})

Deno.test("Non-specified input format", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
  })

  assertStrictEquals(output, expected)
})

Deno.test("Invalid message digest algorithm", async () => {
  const input = "_:b0 <ex:p> _:b1 ."
  const messageDigestAlgorithm = "INVALID"

  try {
    await rdf.canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      messageDigestAlgorithm,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unsupported algorithm "${messageDigestAlgorithm}".`)
  }
})

Deno.test("Invalid output format", async () => {
  const input: Array<string> = []
  const outputFormat = "invalid"

  try {
    await rdf.canonize(input, {
      algorithm: "RDFC-1.0",
      format: outputFormat,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unknown canonicalization output format: "${outputFormat}".`)
  }
})

Deno.test("Valid output format", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
  })

  assertStrictEquals(output, expected)
})

Deno.test("Invalid empty dataset as N-Quads", async () => {
  const input: Array<string> = []

  try {
    await rdf.canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, "N-Quads input must be a string.")
  }
})

Deno.test("Canonical Id Map", async () => {
  const input = `_:b0 <urn:p0> _:b1 .\n_:b1 <urn:p1> "v1" .`
  const expected = `_:c14n0 <urn:p0> _:c14n1 .\n_:c14n1 <urn:p1> "v1" .\n`

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

  assertEquals(output, expected)
  assertEquals(canonicalIdMap, expectedMap)
})

Deno.test("Allow URDNA-2015 by default", async () => {
  await rdf.canonize([], {
    algorithm: "URDNA2015",
  })
})

Deno.test("Reject URDNA-2015 when specified", async () => {
  const algorithm = "URDNA2015"
  try {
    await rdf.canonize([], {
      algorithm,
      rejectURDNA2015: true,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Invalid RDF Dataset Canonicalization algorithm: ${algorithm}`)
  }
})

Deno.test("Abort when signal specified", async () => {
  const data = mockData1([10, 10]).data

  try {
    await rdf.canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      signal: AbortSignal.timeout(100),
      maxDeepIterations: Infinity,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Abort signal received: "TimeoutError: Signal timed out.".`)
  }
})

Deno.test("Abort when work factor specified 1", async () => {
  const data = mockData2(2, 2).data

  try {
    await rdf.canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxWorkFactor: 0,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("Abort when work factor specified 2", async () => {
  const data = mockData2(3, 3).data

  try {
    await rdf.canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxWorkFactor: 1,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("Not abort when work factor specified 1", async () => {
  const data = mockData2(3, 3).data

  await rdf.canonize(data, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    maxWorkFactor: Infinity,
  })
})

Deno.test("Not abort when work factor specified 2", async () => {
  const data = mockData2(3, 3).data

  await rdf.canonize(data, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    maxWorkFactor: 1,
    maxDeepIterations: 33,
  })
})

Deno.test("Abort when max iterations specified 1", async () => {
  const data = mockData2(2, 2).data

  try {
    await rdf.canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxDeepIterations: 0,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("Abort when max iterations specified 2", async () => {
  const data = mockData2(6, 6).data

  try {
    await rdf.canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxDeepIterations: 1000,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("Escape IRI", async () => {
  const input: RdfDataset = [
    {
      subject: { termType: "NamedNode", value: "ex:s" },
      predicate: { termType: "NamedNode", value: "ex:p" },
      object: { termType: "NamedNode", value: "ex:o" },
      graph: { termType: "NamedNode", value: "ex:g" },
    },
  ]

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
  })
  const expected = `<ex:s> <ex:p> <ex:o> <ex:g> .\n`
  assertEquals(output, expected)
})

Deno.test("Serialize RDF datasets", () => {
  const input: RdfDataset = [
    {
      subject: { termType: "BlankNode", value: "b0" },
      predicate: { termType: "BlankNode", value: "b1" },
      object: { termType: "BlankNode", value: "b2" },
      graph: { termType: "DefaultGraph", value: "" },
    },
    {
      subject: { termType: "BlankNode", value: "b3" },
      predicate: { termType: "BlankNode", value: "b4" },
      object: { termType: "BlankNode", value: "b5" },
      graph: { termType: "DefaultGraph", value: "" },
    },
  ]

  const output = rdf.serialize(input)
  const expected1 = `_:b0 _:b1 _:b2 .`
  const expected2 = `_:b3 _:b4 _:b5 .`

  assertEquals(output[0], expected1)
  assertEquals(output[1], expected2)
})

Deno.test("Duplicated quads", async () => {
  const input = `_:b0 <ex:p> _:b1 .\n_:b0 <ex:p> _:b1 .`
  const expected = `_:c14n1 <ex:p> _:c14n0 .\n`

  const output = await rdf.canonize(input, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
  })

  assertEquals(output, expected)
})

Deno.test("Invalid N-Quads", async () => {
  const input = `_:b0 <ex:p> .\n`

  try {
    await rdf.canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /N-Quads parse error on line \d+\./)
  }
})

function mockData1(counts: number[]): { n: number; data: string } {
  if (counts.length < 2) throw new Error("Need more counts")

  let n = 0
  const data = counts.slice(0, -1).reduce((acc, count, level) => {
    return acc + Array.from({ length: count }, (_, cur) =>
      Array.from({ length: counts[level + 1] }, (_, next) => {
        n++
        return `_:s_${level}_${cur} <ex:p> _:s_${level + 1}_${next} .\n`
      }).join("")).join("")
  }, "")

  return { n, data }
}

function mockData2(subjects: number, objects: number): { n: number; data: string } {
  let n = 0
  const data = Array.from({ length: subjects }, (_, subject) =>
    Array.from({ length: objects }, (_, object) => {
      if (subject !== object) {
        n++
        return `_:s_${subject} <ex:p> _:o_${object} .\n`
      }
      return ""
    }).join("")).join("")
  return { n, data }
}
