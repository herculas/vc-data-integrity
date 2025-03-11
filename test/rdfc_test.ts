import { assertEquals, assertExists, assertMatch, assertStrictEquals } from "@std/assert"

import { canonize, compact, expand, flatten, frame, normalize, serialize, toRdf } from "../src/serialize/rdfc.ts"

import type { ContextDefinition } from "../src/types/serialize/context.ts"
import type { JsonLdDocument, JsonLdObject } from "../src/types/serialize/document.ts"
import type { RdfDataset } from "../src/types/serialize/rdf.ts"

/**
 * Compaction uses a developer-supplied context to shorten IRIs to terms or compact IRIs and JSON-LD values expressed in
 * expanded form to simple values such as strings or numbers.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#compaction
 */
Deno.test("JSON-LD document compaction: basic 1", async () => {
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

  const context: ContextDefinition = {
    "name": "http://xmlns.com/foaf/0.1/name",
    "homepage": {
      "@id": "http://xmlns.com/foaf/0.1/homepage",
      "@type": "@id",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * Compaction uses a developer-supplied context to shorten IRIs to terms or compact IRIs and JSON-LD values expressed in
 * expanded form to simple values such as strings or numbers.
 *
 * @see https://www.w3.org/TR/json-ld/#compacted-document-form
 */
Deno.test("JSON-LD document compaction: basic 2", async () => {
  const expandedDocument: JsonLdDocument = [
    {
      "http://xmlns.com/foaf/0.1/name": [
        "Manu Sporny",
      ],
      "http://xmlns.com/foaf/0.1/homepage": [
        {
          "@id": "http://manu.sporny.org/",
        },
      ],
    },
  ] as const

  const context: ContextDefinition = {
    "name": "http://xmlns.com/foaf/0.1/name",
    "homepage": {
      "@id": "http://xmlns.com/foaf/0.1/homepage",
      "@type": "@id",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * In an expanded JSON-LD document, IRIs are always represented as absolute IRIs. In many cases, it is preferable to use
 * shorten version, either a relative IRI reference, compact IRI, or term. Compaction uses a combination of elements in
 * a context to create a shorter form of these IRIs.
 *
 * The vocabulary mapping can be used to shorten IRIs that may be vocabulary relative by removing the IRI prefix that
 * matches the vocabulary mapping. This is done whenever an IRI is determined to be vocabulary relative, i.e., used as a
 * property, or a value of `@type`, or as the value of a term described as `"@type": "@vocab"`.
 *
 * @see https://www.w3.org/TR/json-ld/#shortening-iris
 */
Deno.test("JSON-LD document compaction: shortening IRIs", async () => {
  const expandedDocument: JsonLdDocument = [{
    "@id": "http://example.org/places#BrewEats",
    "@type": [
      "http://example.org/Restaurant",
    ],
    "http://example.org/name": [
      {
        "@value": "Brew Eats",
      },
    ],
  }] as const

  const context: ContextDefinition = {
    "@vocab": "http://example.org/",
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * In an expanded JSON-LD document, IRIs are always represented as absolute IRIs. In many cases, it is preferable to use
 * shorten version, either a relative IRI reference, compact IRI, or term. Compaction uses a combination of elements in
 * a context to create a shorter form of these IRIs.
 *
 * The vocabulary mapping can be used to shorten IRIs that may be vocabulary relative by removing the IRI prefix that
 * matches the vocabulary mapping. This is done whenever an IRI is determined to be vocabulary relative, i.e., used as a
 * property, or a value of `@type`, or as the value of a term described as `"@type": "@vocab"`.
 *
 * @see https://www.w3.org/TR/json-ld/#shortening-iris
 */
Deno.test("JSON-LD document compaction: compacting using a base IRI", async () => {
  const expandedDocument: JsonLdDocument = [{
    "@id": "http://example.com/document.jsonld",
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Just a simple document",
      },
    ],
  }] as const

  const context: ContextDefinition = {
    "@base": "http://example.com/",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * To be unambiguous, the expanded document form always represents nodes and values using node objects and value
 * objects. Moreover, property values are always contained within an array, even when there is only one value. Sometimes
 * this is useful to maintain a uniformity of access, but most JSON data use the simplest possible representation,
 * meaning that properties have single values, which are represented as strings or as structured values such as node
 * objects.
 *
 * By default, compaction will represent values which are simple strings as strings, but sometimes a value is an IRI, a
 * date, or some other typed value for which a simple string representation would loose information. By specifying this
 * within a term definition, the semantics of a string value can be inferred from the definition of the term used as a
 * property.
 *
 * @see https://www.w3.org/TR/json-ld/#representing-values-as-strings
 */
Deno.test("JSON-LD document compaction: representing values as strings", async () => {
  const expandedDocument: JsonLdDocument = [{
    "http://example.com/plain": [
      {
        "@value": "string",
      },
      {
        "@value": true,
      },
      {
        "@value": 1,
      },
    ],
    "http://example.com/date": [
      {
        "@value": "2018-02-16",
        "@type": "http://www.w3.org/2001/XMLSchema#date",
      },
    ],
    "http://example.com/en": [
      {
        "@value": "English",
        "@language": "en",
      },
    ],
    "http://example.com/iri": [
      {
        "@id": "http://example.com/some-location",
      },
    ],
  }] as const

  const context: ContextDefinition = {
    "@vocab": "http://example.com/",
    "date": {
      "@type": "http://www.w3.org/2001/XMLSchema#date",
    },
    "en": {
      "@language": "en",
    },
    "iri": {
      "@type": "@id",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * JSON-LD has an expanded syntax for representing ordered values, using the `@list` keyword. To simplify the
 * representation in JSON-LD, a term can be defined with `"@container": "@list"` which causes all values of a property
 * using such a term to be considered ordered.
 *
 * @see https://www.w3.org/TR/json-ld/#representing-lists-as-arrays
 */
Deno.test("JSON-LD document compaction: representing lists as arrays", async () => {
  const expandedDocument: JsonLdDocument = [{
    "http://xmlns.com/foaf/0.1/nick": [
      {
        "@list": [
          {
            "@value": "joe",
          },
          {
            "@value": "bob",
          },
          {
            "@value": "jaybee",
          },
        ],
      },
    ],
  }] as const

  const context: ContextDefinition = {
    "nick": {
      "@id": "http://xmlns.com/foaf/0.1/nick",
      "@container": "@list",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * In some cases, the property used to relate two nodes may be better expressed if the nodes have a reverse direction,
 * for example, when describing a relationship between two people and a common parent.
 *
 * Reverse properties can be even more useful when combined with framing, which can actually make node objects defined
 * at the top-level of a document to become embedded nodes. JSON-LD provides a means to index such values, by defining
 * an appropriate `@container` definition within a term definition.
 *
 * @see https://www.w3.org/TR/json-ld/#reversing-node-relationships
 */
Deno.test("JSON-LD document compaction: reversing node relationships", async () => {
  const expandedDocument: JsonLdDocument = [{
    "@id": "http://example.org/#homer",
    "http://example.com/vocab#name": [
      {
        "@value": "Homer",
      },
    ],
    "@reverse": {
      "http://example.com/vocab#parent": [
        {
          "@id": "http://example.org/#bart",
          "http://example.com/vocab#name": [
            {
              "@value": "Bart",
            },
          ],
        },
        {
          "@id": "http://example.org/#lisa",
          "http://example.com/vocab#name": [
            {
              "@value": "Lisa",
            },
          ],
        },
      ],
    },
  }] as const

  const context: ContextDefinition = {
    "name": "http://example.com/vocab#name",
    "children": { "@reverse": "http://example.com/vocab#parent" },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * Properties with multiple values are typically represented using an unordered array. This means that an application
 * working on an internalized representation of that JSON would need to iterate through the values of the array to find
 * a value matching a particular pattern, such as a language-tagged string using the language en.
 *
 * Data can be indexed on a number of different keys, including `@id`, `@type`, `@language`, `@index` and more.
 *
 * @see https://www.w3.org/TR/json-ld/#indexing-values
 */
Deno.test("JSON-LD document compaction: indexing values", async () => {
  const expandedDocument: JsonLdDocument = [{
    "@id": "http://example.com/queen",
    "http://example.com/vocab/label": [
      {
        "@value": "The Queen",
        "@language": "en",
      },
      {
        "@value": "Die Königin",
        "@language": "de",
      },
      {
        "@value": "Ihre Majestät",
        "@language": "de",
      },
    ],
  }] as const

  const context: ContextDefinition = {
    "vocab": "http://example.com/vocab/",
    "label": {
      "@id": "vocab:label",
      "@container": "@language",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * Sometimes it is useful to compact a document, but keep the node object and value object representations. For this, a
 * term definition can set `"@type": "@none"`. This causes the Value Compaction algorithm to always use the object form
 * of values, although components of that value may be compacted.
 *
 * @see https://www.w3.org/TR/json-ld/#normalizing-values-as-objects
 */
Deno.test("JSON-LD document compaction: normalizing values as objects", async () => {
  const expandedDocument: JsonLdDocument = [{
    "http://example.com/notype": [
      { "@value": "string" },
      { "@value": true },
      { "@value": false },
      { "@value": 1 },
      { "@value": 10.0 },
      { "@value": "plain" },
      { "@value": "false", "@type": "http://www.w3.org/2001/XMLSchema#boolean" },
      { "@value": "english", "@language": "en" },
      { "@value": "2018-02-17", "@type": "http://www.w3.org/2001/XMLSchema#date" },
      { "@id": "http://example.com/iri" },
    ],
  }] as const

  const context: ContextDefinition = {
    "@version": 1.1,
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "notype": {
      "@id": "http://example.com/notype",
      "@type": "@none",
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * Generally, when compacting, properties having only one value are represented as strings or maps, while properties
 * having multiple values are represented as an array of strings or maps. This means that applications accessing such
 * properties need to be prepared to accept either representation.
 *
 * To force all values to be represented using an array, a term definition can set `"@container": "@set"`. Moreover,
 * `@set` can be used in combination with other container settings.
 *
 * @see https://www.w3.org/TR/json-ld/#representing-singular-values-as-arrays
 */
Deno.test("JSON-LD document compaction: representing singular values as arrays", async () => {
  const expandedDocument: JsonLdDocument = [{
    "@id": "http://example.com/queen",
    "http://example.com/vocab/label": [
      { "@value": "The Queen", "@language": "en" },
      { "@value": "Die Königin", "@language": "de" },
      { "@value": "Ihre Majestät", "@language": "de" },
    ],
  }] as const

  const context: ContextDefinition = {
    "@version": 1.1,
    "@vocab": "http://example.com/vocab/",
    "label": {
      "@container": [
        "@language",
        "@set",
      ],
    },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * When compacting, the Compaction algorithm will compact using a term for a property only when the values of that
 * property match the `@container`, `@type`, and `@language` specifications for that term definition. This can actually
 * split values between different properties, all of which have the same IRI.
 *
 * In case there is no matching term definition, the compaction algorithm will compact using the absolute IRI of the
 * property.
 *
 * @see https://www.w3.org/TR/json-ld/#term-selection
 */
Deno.test("JSON-LD document compaction: term selection", async () => {
  const expandedDocument: JsonLdDocument = [{
    "http://example.com/vocab/property": [
      { "@value": "string" },
      { "@value": true },
      { "@value": 1 },
      { "@value": "false", "@type": "http://www.w3.org/2001/XMLSchema#boolean" },
      { "@value": "10", "@type": "http://www.w3.org/2001/XMLSchema#integer" },
      { "@value": "english", "@language": "en" },
      { "@value": "2018-02-17", "@type": "http://www.w3.org/2001/XMLSchema#date" },
      { "@id": "http://example.com/some-location" },
    ],
  }] as const

  const context: ContextDefinition = {
    "vocab": "http://example.com/vocab/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "integer": { "@id": "vocab:property", "@type": "xsd:integer" },
    "date": { "@id": "vocab:property", "@type": "xsd:date" },
    "english": { "@id": "vocab:property", "@language": "en" },
    "list": { "@id": "vocab:property", "@container": "@list" },
    "iri": { "@id": "vocab:property", "@type": "@id" },
  } as const

  const compactedDocument = await compact(expandedDocument, context)
  console.log(compactedDocument)
})

/**
 * Before performing any other transformations on a JSON-LD document, it is easiest to remove any context from it and to
 * make data structures more regular.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#expansion
 */
Deno.test("JSON-LD document expansion 1", async () => {
  const compactedDocument: JsonLdDocument = {
    "@context": {
      "name": "http://xmlns.com/foaf/0.1/name",
      "homepage": {
        "@id": "http://xmlns.com/foaf/0.1/homepage",
        "@type": "@id",
      },
    },
    "@id": "http://me.markus-lanthaler.com/",
    "name": "Markus Lanthaler",
    "homepage": "http://www.markus-lanthaler.com/",
  } as const

  const expandedDocument = await expand(compactedDocument)
  console.log(expandedDocument)
})

/**
 * This example uses one IRI to express a property and a map to encapsulate a value, but leaves the rest of the
 * information untouched.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#expansion
 */
Deno.test("JSON-LD document expansion 2", async () => {
  const compactedDocument: JsonLdDocument = {
    "@context": {
      "website": "http://xmlns.com/foaf/0.1/homepage",
    },
    "@id": "http://me.markus-lanthaler.com/",
    "http://xmlns.com/foaf/0.1/name": "Markus Lanthaler",
    "website": { "@id": "http://www.markus-lanthaler.com/" },
  } as const

  const expandedDocument = await expand(compactedDocument)
  console.log(expandedDocument)
})

/**
 * Expansion is the process of taking a JSON-LD document and applying a context such that all IRIs, types, and values
 * are expanded so that `@context` is no longer necessary.
 *
 * @see https://www.w3.org/TR/json-ld/#expanded-document-form
 */
Deno.test("JSON-LD document expansion 3", async () => {
  const compactedDocument: JsonLdDocument = {
    "@context": {
      "name": "http://xmlns.com/foaf/0.1/name",
      "homepage": {
        "@id": "http://xmlns.com/foaf/0.1/homepage",
        "@type": "@id",
      },
    },
    "name": "Manu Sporny",
    "homepage": "http://manu.sporny.org/",
  } as const

  const expandedDocument = await expand(compactedDocument)
  console.log(expandedDocument)
})

/**
 * While expansion ensures that a document is in a uniform structure, flattening goes a step further to ensure that the
 * shape of the data is deterministic. In expanded documents, the properties of a single node may be spread across a
 * number of different node objects.
 *
 * By flattening a document, all properties of a node are collected in a single node object and all blank nodes are
 * labeled with a blank node identifier. This may drastically simplify the code required to process JSON-LD data in
 *  certain applications.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#flattening
 */
Deno.test("JSON-LD document flattening 1", async () => {
  const document: JsonLdDocument = {
    "@context": {
      "name": "http://xmlns.com/foaf/0.1/name",
      "knows": "http://xmlns.com/foaf/0.1/knows",
    },
    "@id": "http://me.markus-lanthaler.com/",
    "name": "Markus Lanthaler",
    "knows": [
      { "name": "Dave Longley" },
    ],
  } as const

  const flattenedDocument = await flatten(document)
  const compactedDocument = await compact(flattenedDocument, document["@context"]!)

  console.log(flattenedDocument)
  console.log(compactedDocument)
})

/**
 * Flattening collects all properties of a node in a single map and labels all blank nodes with blank node identifiers.
 * This ensures a shape of the data and consequently may drastically simplify the code required to process JSON-LD in
 * certain applications.
 *
 * @see https://www.w3.org/TR/json-ld/#flattened-document-form
 */
Deno.test("JSON-LD document flattening 2", async () => {
  const document: JsonLdDocument = {
    "@context": {
      "name": "http://xmlns.com/foaf/0.1/name",
      "knows": "http://xmlns.com/foaf/0.1/knows",
    },
    "@id": "http://me.markus-lanthaler.com/",
    "name": "Markus Lanthaler",
    "knows": [
      {
        "@id": "http://manu.sporny.org/about#manu",
        "name": "Manu Sporny",
      },
      {
        "name": "Dave Longley",
      },
    ],
  } as const

  const flattenedDocument = await flatten(document)
  const compactedDocument = await compact(flattenedDocument, document["@context"]!)
  console.log(compactedDocument)
})

/**
 * Framing is used to shape the data in a JSON-LD document, using an example frame document which is used to both match
 * the flattened data and show an example of how the resulting data should be shaped.
 *
 * @see https://www.w3.org/TR/json-ld/#framed-document-form
 */
Deno.test("JSON-LD document framing: basic 1", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": {
      "@version": 1.1,
      "@vocab": "http://example.org/",
    },
    "@type": "Library",
    "contains": {
      "@type": "Book",
      "contains": {
        "@type": "Chapter",
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * Framing is used to shape the data in a JSON-LD document, using an example frame document which is used to both match
 * the flattened data and show an example of how the resulting data should be shaped. Matching is performed by using
 * properties present in in the frame to find objects in the data that share common values. Matching can be done either
 * using all properties present in the frame, or any property in the frame. By chaining together objects using matched
 * property values, objects can be embedded within one another.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#framing
 */
Deno.test("JSON-LD document framing: basic 2", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
    },
    "@type": "Library",
    "contains": {
      "@type": "Book",
      "contains": {
        "@type": "Chapter",
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * In addition to matching on types, a frame can match on one or more properties. For example, the following frame
 * selects object based on property values, rather than `@type`.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-properties
 */
Deno.test("JSON-LD document framing: matching on properties", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
    },
    "location": "Athens",
    "contains": {
      "title": "The Republic",
      "contains": {
        "title": "The Introduction",
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * The empty map (`{}`) is used as a wildcard, which will match a property if it exists in a target node object,
 * independent of any specific value.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#wildcard-matching
 */
Deno.test("JSON-LD document framing: wildcard matching", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": { "@vocab": "http://example.org/" },
    "location": {},
    "contains": {
      "creator": {},
      "contains": {
        "description": {},
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * The empty array (`[]`) is used for match none, which will match a node object only if a property does not exist in a
 * target node object.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#match-on-the-absence-of-a-property
 */
Deno.test("JSON-LD document framing: matching on the absence of a property", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": { "@vocab": "http://example.org/" },
    "creator": [],
    "title": [],
    "contains": {
      "location": [],
      "description": [],
      "contains": {
        "location": [],
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * Frames can be matched based on the presence of specific property values. These values can themselves use wildcards,
 * to match on a specific or set of values, language tags, types, or base direction.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-values
 */
Deno.test("JSON-LD document framing: matching on values", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
    },
    "location": {
      "@value": {},
      "@language": "el-Latn",
    },
    "contains": {
      "creator": {
        "@value": {},
        "@language": "el-Latn",
      },
      "title": {
        "@value": {},
        "@language": "el-Latn",
      },
      "contains": {
        "title": "The Introduction",
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": {
        "@type": "@id",
      },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": [
        {
          "@value": "Athens",
          "@language": "en",
        },
        {
          "@value": "Αθήνα",
          "@language": "grc",
        },
        {
          "@value": "Athína",
          "@language": "el-Latn",
        },
      ],
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": [
        {
          "@value": "Plato",
          "@language": "en",
        },
        {
          "@value": "Πλάτων",
          "@language": "grc",
        },
        {
          "@value": "Plátōn",
          "@language": "el-Latn",
        },
      ],
      "title": [
        {
          "@value": "The Republic",
          "@language": "en",
        },
        {
          "@value": "Πολιτεία",
          "@language": "grc",
        },
        {
          "@value": "Res Publica",
          "@language": "el-Latn",
        },
      ],
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * Frames can be matched if they match a specific identifier (`@id`). This can be illustrated with the original
 * Flattened library objects input using a frame which matches on specific `@id` values.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-id
 */
Deno.test("JSON-LD document framing: matching on id 1", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": { "@vocab": "http://example.org/" },
    "@id": "http://example.org/library",
    "contains": {
      "@id": "http://example.org/library/the-republic",
      "contains": {
        "@id": "http://example.org/library/the-republic#introduction",
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * Frames can also be matched from an array of identifiers. Within a frame, it is acceptable for `@id` to have an array
 * value, where the individual values are treated as IRIs.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-id
 */
Deno.test("JSON-LD document framing: matching on id 2", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": { "@vocab": "http://example.org/" },
    "@id": [
      "http://example.org/home",
      "http://example.org/library",
    ],
    "contains": {
      "@id": [
        "http://example.org/library/the-republic",
      ],
      "contains": {
        "@id": [
          "http://example.org/library/the-republic#introduction",
        ],
      },
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * An empty frame matches any node object, even if those objects are embedded elsewhere, causing them to be serialized
 * at the top level.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#empty-frame-0
 */
Deno.test("JSON-LD document framing: empty frame", async () => {
  const frameDoc: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
    },
  } as const

  const flattenedDocument: JsonLdDocument = {
    "@context": {
      "@vocab": "http://example.org/",
      "contains": { "@type": "@id" },
    },
    "@graph": [{
      "@id": "http://example.org/library",
      "@type": "Library",
      "location": "Athens",
      "contains": "http://example.org/library/the-republic",
    }, {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      "creator": "Plato",
      "title": "The Republic",
      "contains": "http://example.org/library/the-republic#introduction",
    }, {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      "description": "An introductory chapter on The Republic.",
      "title": "The Introduction",
    }],
  } as const

  const framedDocument = await frame(flattenedDocument, frameDoc)
  console.log(framedDocument)
})

/**
 * JSON-LD can be used to serialize RDF data. This ensures that data can be round-tripped to and from any RDF syntax
 * without any loss in fidelity.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#rdf-serialization-deserialization
 */
Deno.test("JSON-LD document normalization", async () => {
  const document: JsonLdDocument = [
    {
      "@id": "http://me.markus-lanthaler.com/",
      "http://xmlns.com/foaf/0.1/name": [
        { "@value": "Markus Lanthaler" },
      ],
      "http://xmlns.com/foaf/0.1/homepage": [
        { "@id": "http://www.markus-lanthaler.com/" },
      ],
    },
  ] as const

  const normalizedDocument = await normalize(document)
  console.log(normalizedDocument)
})

Deno.test("JSON-LD document to RDF: simple case", async () => {
  const document: JsonLdDocument = {
    "@id": "https://example.com/",
    "https://example.com/test": "test",
  } as const

  const rdfDocument = await toRdf(document, { format: "application/n-quads" })
  const expected = `<https://example.com/> <https://example.com/test> "test" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: relative graph reference", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "rel",
      "@graph": [
        {
          "@id": "s:1",
          "ex:p": [
            {
              "@value": "v1",
            },
          ],
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, { format: "application/n-quads", skipExpansion: true })
  const expected = ""
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: relative subject reference", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "rel",
      "ex:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, { format: "application/n-quads", skipExpansion: true })
  const expected = ""
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: relative predicate reference", async () => {
  const input: JsonLdDocument = [
    {
      "rel": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, { format: "application/n-quads", skipExpansion: true })
  const expected = ""
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: relative object reference", async () => {
  const input: JsonLdDocument = [
    {
      "@type": [
        "rel",
      ],
      "ex:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, { format: "application/n-quads", skipExpansion: true })
  const expected = `_:b0 <ex:p> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: blank node predicates", async () => {
  const input: JsonLdDocument = [
    {
      "_:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, { format: "application/n-quads", skipExpansion: true })
  const expected = ``
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: generalized blank node predicates", async () => {
  const input: JsonLdDocument = [
    {
      "_:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    produceGeneralizedRdf: true,
  })
  const expected = `_:b0 <_:b1> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: no @lang, no @dir, rdfDirection is null", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: null,
  })
  const expected = `<urn:id> <ex:p> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: no @lang, no @dir, rdfDirection is i18n", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: "i18n-datatype",
  })
  const expected = `<urn:id> <ex:p> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: no @lang, with @dir, rdfDirection unspecified", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@direction": "ltr",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
  })
  const expected = `<urn:id> <ex:p> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: no @lang, with @dir, rdfDirection is null", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@direction": "ltr",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: null,
  })
  const expected = `<urn:id> <ex:p> "v" .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: no @lang, with @dir, rdfDirection is i18n", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@direction": "ltr",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: "i18n-datatype",
  })
  const expected = `<urn:id> <ex:p> "v"^^<https://www.w3.org/ns/i18n#_ltr> .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: with @lang, no @dir, rdfDirection is null", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@language": "en-us",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: null,
  })
  const expected = `<urn:id> <ex:p> "v"@en-us .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: with @lang, no @dir, rdfDirection is i18n", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@language": "en-us",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: "i18n-datatype",
  })
  const expected = `<urn:id> <ex:p> "v"@en-us .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: with @lang, with @dir, rdfDirection is null", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@direction": "ltr",
          "@language": "en-us",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: null,
  })
  const expected = `<urn:id> <ex:p> "v"@en-us .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: with @lang, with @dir, rdfDirection is i18n", async () => {
  const input: JsonLdDocument = [
    {
      "@id": "urn:id",
      "ex:p": [
        {
          "@direction": "ltr",
          "@language": "en-us",
          "@value": "v",
        },
      ],
    },
  ] as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: true,
    rdfDirection: "i18n-datatype",
  })
  const expected = `<urn:id> <ex:p> "v"^^<https://www.w3.org/ns/i18n#en-us_ltr> .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: context with @lang/@dir, rdfDirection is null", async () => {
  const input: JsonLdDocument = {
    "@context": {
      "@version": 1.1,
      "@language": "ar-EG",
      "@direction": "rtl",
      "ex": "urn:ex:",
      "publisher": { "@id": "ex:publisher", "@direction": null },
      "title": { "@id": "ex:title" },
      "title_en": { "@id": "ex:title", "@language": "en", "@direction": "ltr" },
    },
    "publisher": "NULL",
    "title": "RTL",
    "title_en": "LTR",
  } as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: false,
    rdfDirection: null,
  })

  const expected = `_:b0 <urn:ex:publisher> "NULL"@ar-eg .\n` +
    `_:b0 <urn:ex:title> "LTR"@en .\n` +
    `_:b0 <urn:ex:title> "RTL"@ar-eg .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document to RDF: context with @lang/@dir, rdfDirection is i18n", async () => {
  const input: JsonLdDocument = {
    "@context": {
      "@version": 1.1,
      "@language": "ar-EG",
      "@direction": "rtl",
      "ex": "urn:ex:",
      "publisher": { "@id": "ex:publisher", "@direction": null },
      "title": { "@id": "ex:title" },
      "title_en": { "@id": "ex:title", "@language": "en", "@direction": "ltr" },
    },
    "publisher": "NULL",
    "title": "RTL",
    "title_en": "LTR",
  } as const

  const rdfDocument = await toRdf(input, {
    format: "application/n-quads",
    skipExpansion: false,
    rdfDirection: "i18n-datatype",
  })

  const expected = `_:b0 <urn:ex:publisher> "NULL"@ar-eg .\n` +
    `_:b0 <urn:ex:title> "LTR"^^<https://www.w3.org/ns/i18n#en_ltr> .\n` +
    `_:b0 <urn:ex:title> "RTL"^^<https://www.w3.org/ns/i18n#ar-eg_rtl> .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("JSON-LD document expand and to RDF", async () => {
  const input: JsonLdDocument = {
    "@context": {
      "ex": "urn:ex#",
      "ex:prop": {
        "@type": "@id",
      },
    },
    "@id": "urn:id",
    "@type": "ex:type",
    "ex:prop": "value",
  } as const

  const expanded: Array<JsonLdObject> = [
    {
      "@id": "urn:id",
      "@type": [
        "urn:ex#type",
      ],
      "urn:ex#prop": [
        {
          "@id": "value",
        },
      ],
    },
  ] as const

  const expandedDocument = await expand(input)
  assertEquals(expandedDocument, expanded)

  const rdfDocument = await toRdf(expanded, {
    format: "application/n-quads",
    skipExpansion: true,
  })

  const expected = `<urn:id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:ex#type> .\n`
  assertStrictEquals(rdfDocument, expected)
})

Deno.test("RDF: Invalid algorithm", async () => {
  const input: Array<string> = []
  const algorithm = "INVALID"

  try {
    await canonize(input, {
      algorithm,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Invalid RDF Dataset Canonicalization algorithm: ${algorithm}`)
  }
})

Deno.test("RDF: Invalid input format", async () => {
  const input = ""
  const inputFormat = "application/invalid"

  try {
    await canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unknown canonicalization input format: "${inputFormat}".`)
  }
})

Deno.test("RDF: Non-specified input format", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await canonize(input, {
    algorithm: "RDFC-1.0",
  })

  assertStrictEquals(output, expected)
})

Deno.test("RDF: Invalid message digest algorithm", async () => {
  const input = "_:b0 <ex:p> _:b1 ."
  const messageDigestAlgorithm = "INVALID"

  try {
    await canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      messageDigestAlgorithm,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unsupported algorithm "${messageDigestAlgorithm}".`)
  }
})

Deno.test("RDF: Invalid output format", async () => {
  const input: Array<string> = []
  const outputFormat = "invalid"

  try {
    await canonize(input, {
      algorithm: "RDFC-1.0",
      format: outputFormat,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Unknown canonicalization output format: "${outputFormat}".`)
  }
})

Deno.test("RDF: Valid output format", async () => {
  const input: Array<string> = []
  const expected = ""

  const output = await canonize(input, {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
  })

  assertStrictEquals(output, expected)
})

Deno.test("RDF: Invalid empty dataset as N-Quads", async () => {
  const input: Array<string> = []

  try {
    await canonize(input, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, "N-Quads input must be a string.")
  }
})

Deno.test("RDF: Canonical Id Map", async () => {
  const input = `_:b0 <urn:p0> _:b1 .\n_:b1 <urn:p1> "v1" .`
  const expected = `_:c14n0 <urn:p0> _:c14n1 .\n_:c14n1 <urn:p1> "v1" .\n`

  const expectedMap = new Map([
    ["b0", "c14n0"],
    ["b1", "c14n1"],
  ])

  const canonicalIdMap = new Map<string, string>()

  const output = await canonize(input, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    canonicalIdMap,
  })

  assertEquals(output, expected)
  assertEquals(canonicalIdMap, expectedMap)
})

Deno.test("RDF: Allow URDNA-2015 by default", async () => {
  await canonize([], {
    algorithm: "URDNA2015",
  })
})

Deno.test("RDF: Reject URDNA-2015 when specified", async () => {
  const algorithm = "URDNA2015"
  try {
    await canonize([], {
      algorithm,
      rejectURDNA2015: true,
    })
  } catch (e) {
    assertExists(e)
    assertEquals((e as Error).message, `Invalid RDF Dataset Canonicalization algorithm: ${algorithm}`)
  }
})

Deno.test("RDF: Abort when signal specified", async () => {
  const data = mockData1([10, 10]).data

  try {
    await canonize(data, {
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

Deno.test("RDF: Abort when work factor specified 1", async () => {
  const data = mockData2(2, 2).data

  try {
    await canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxWorkFactor: 0,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("RDF: Abort when work factor specified 2", async () => {
  const data = mockData2(3, 3).data

  try {
    await canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxWorkFactor: 1,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("RDF: Not abort when work factor specified 1", async () => {
  const data = mockData2(3, 3).data

  await canonize(data, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    maxWorkFactor: Infinity,
  })
})

Deno.test("RDF: Not abort when work factor specified 2", async () => {
  const data = mockData2(3, 3).data

  await canonize(data, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
    maxWorkFactor: 1,
    maxDeepIterations: 33,
  })
})

Deno.test("RDF: Abort when max iterations specified 1", async () => {
  const data = mockData2(2, 2).data

  try {
    await canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxDeepIterations: 0,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("RDF: Abort when max iterations specified 2", async () => {
  const data = mockData2(6, 6).data

  try {
    await canonize(data, {
      algorithm: "RDFC-1.0",
      inputFormat: "application/n-quads",
      maxDeepIterations: 1000,
    })
  } catch (e) {
    assertExists(e)
    assertMatch((e as Error).message, /Maximum deep iterations exceeded \(\d+\)\./)
  }
})

Deno.test("RDF: Escape IRI", async () => {
  const input: RdfDataset = [
    {
      subject: { termType: "NamedNode", value: "ex:s" },
      predicate: { termType: "NamedNode", value: "ex:p" },
      object: { termType: "NamedNode", value: "ex:o" },
      graph: { termType: "NamedNode", value: "ex:g" },
    },
  ]

  const output = await canonize(input, {
    algorithm: "RDFC-1.0",
  })
  const expected = `<ex:s> <ex:p> <ex:o> <ex:g> .\n`
  assertEquals(output, expected)
})

Deno.test("RDF: Serialize RDF datasets", () => {
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

  const output = serialize(input)
  const expected1 = `_:b0 _:b1 _:b2 .`
  const expected2 = `_:b3 _:b4 _:b5 .`

  assertEquals(output[0], expected1)
  assertEquals(output[1], expected2)
})

Deno.test("RDF: Duplicated quads", async () => {
  const input = `_:b0 <ex:p> _:b1 .\n_:b0 <ex:p> _:b1 .`
  const expected = `_:c14n1 <ex:p> _:c14n0 .\n`

  const output = await canonize(input, {
    algorithm: "RDFC-1.0",
    inputFormat: "application/n-quads",
  })

  assertEquals(output, expected)
})

Deno.test("RDF: Invalid N-Quads", async () => {
  const input = `_:b0 <ex:p> .\n`

  try {
    await canonize(input, {
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
