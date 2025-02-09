import { assert, assertFalse } from "@std/assert"

import { deepEqual, hasProperty } from "../src/utils/instance.ts"

Deno.test("check object has property: basic", () => {
  const doc = { agent: 1, bravo: [{ charlie: 2 }, { delta: 3 }] }

  assert(hasProperty(doc, "agent"))
  assert(hasProperty(doc, "bravo"))
  assert(hasProperty(doc, "charlie"))
  assert(hasProperty(doc, "delta"))

  assertFalse(hasProperty(doc, "echo"))
  assertFalse(hasProperty(doc, "foxtrot"))
})

Deno.test("check object has property: complicated objects", () => {
  const doc = {
    "@context": "https://www.w3.org/ns/cid/v1",
    "id": "did:example:1145141919810",
    "verificationMethod": [{
      "id": "did:example:1145141919810#key-1",
      "type": "Multikey",
      "controller": "did:example:1145141919810",
      "publicKeyMultibase": "zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv",
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

  assert(hasProperty(doc, "@context"))
  assert(hasProperty(doc, "id"))
  assert(hasProperty(doc, "verificationMethod"))
  assert(hasProperty(doc, "authentication"))
  assert(hasProperty(doc, "assertionMethod"))
  assert(hasProperty(doc, "capabilityDelegation"))
  assert(hasProperty(doc, "capabilityInvocation"))

  assertFalse(hasProperty(doc, "echo"))
  assertFalse(hasProperty(doc, "foxtrot"))
  assertFalse(hasProperty(doc, "golf"))
  assertFalse(hasProperty(doc, "hotel"))
})

Deno.test("check object has property: corner cases", () => {
  assertFalse(hasProperty(undefined, "agent"))
  assertFalse(hasProperty(null, "agent"))
})

Deno.test("deep equality check: basic", () => {
  const doc1 = { a: 1, b: [{ c: 2 }, { d: 3 }] }
  const doc2 = { a: 1, b: [{ d: 3 }, { c: 2 }] }
  assert(deepEqual(doc1, doc2))
})

Deno.test("deep equality check: nested objects", () => {
  const doc1 = { a: 1, b: [{ c: 2, e: [{ f: 4 }, { g: 5 }] }, { d: 3 }], h: { d: 3 } }
  const doc2 = { a: 1, b: [{ d: 3 }, { c: 2, e: [{ f: 4 }, { g: 5 }] }], h: { d: 3 } }
  assert(deepEqual(doc1, doc2))
})

Deno.test("deep equality check: more complicated nested objects", () => {
  const doc1 = [{ a: 1, b: [{ c: 2 }, { d: 3 }] }, {
    e: 4,
    f: [{ g: 112 }, { h: [{ i: [{ k: 1 }, { l: 2 }] }, { j: { m: [{ n: 1 }, { o: 2 }] } }] }],
  }]

  const doc2 = [{ e: 4, f: [{ h: [{ j: { m: [{ o: 2 }, { n: 1 }] } }, { i: [{ l: 2 }, { k: 1 }] }] }, { g: 112 }] }, {
    b: [{ c: 2 }, { d: 3 }],
    a: 1,
  }]
  assert(deepEqual(doc1, doc2))
})

Deno.test("deep equality check: corner cases", () => {
  assert(deepEqual(undefined, null))
  assert(deepEqual(null, undefined))
  assert(deepEqual(undefined, undefined))
  assert(deepEqual(null, null))

  assertFalse(deepEqual(undefined, { a: 1 }))
  assertFalse(deepEqual(null, { a: 1 }))
  assertFalse(deepEqual({ a: 1 }, undefined))
  assertFalse(deepEqual({ a: 1 }, null))

  assert(deepEqual("hello", "hello"))
  assertFalse(deepEqual("hello", "world"))
  assertFalse(deepEqual("hello", { a: 1 }))
  assertFalse(deepEqual({ a: 1 }, "hello"))

  assert(deepEqual({ a: [1, 2, 3] }, { a: [3, 2, 1] }))
  assert(deepEqual({ a: [] }, { a: [] }))

  assertFalse(deepEqual("hello", undefined))
  assertFalse(deepEqual("hello", null))
})
