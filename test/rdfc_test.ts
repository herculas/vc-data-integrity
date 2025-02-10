import * as rdfc from "../src/utils/rdfc.ts"

import type { JsonLdDocument } from "../src/types/jsonld/base.ts"
import type { ContextDefinition } from "../src/types/jsonld/misc.ts"

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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const compactedDocument = await rdfc.compact(expandedDocument, context)
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

  const expandedDocument = await rdfc.expand(compactedDocument)
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

  const expandedDocument = await rdfc.expand(compactedDocument)
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

  const expandedDocument = await rdfc.expand(compactedDocument)
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

  const flattenedDocument = await rdfc.flatten(document)
  const compactedDocument = await rdfc.compact(flattenedDocument, document["@context"]!)

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

  const flattenedDocument = await rdfc.flatten(document)
  const compactedDocument = await rdfc.compact(flattenedDocument, document["@context"]!)
  console.log(compactedDocument)
})

/**
 * Framing is used to shape the data in a JSON-LD document, using an example frame document which is used to both match
 * the flattened data and show an example of how the resulting data should be shaped.
 *
 * @see https://www.w3.org/TR/json-ld/#framed-document-form
 */
Deno.test("JSON-LD document framing: basic 1", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
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
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * In addition to matching on types, a frame can match on one or more properties. For example, the following frame
 * selects object based on property values, rather than `@type`.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-properties
 */
Deno.test("JSON-LD document framing: matching on properties", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * The empty map (`{}`) is used as a wildcard, which will match a property if it exists in a target node object,
 * independent of any specific value.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#wildcard-matching
 */
Deno.test("JSON-LD document framing: wildcard matching", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * The empty array (`[]`) is used for match none, which will match a node object only if a property does not exist in a
 * target node object.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#match-on-the-absence-of-a-property
 */
Deno.test("JSON-LD document framing: matching on the absence of a property", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * Frames can be matched based on the presence of specific property values. These values can themselves use wildcards,
 * to match on a specific or set of values, language tags, types, or base direction.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-values
 */
Deno.test("JSON-LD document framing: matching on values", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * Frames can be matched if they match a specific identifier (`@id`). This can be illustrated with the original
 * Flattened library objects input using a frame which matches on specific `@id` values.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-id
 */
Deno.test("JSON-LD document framing: matching on id 1", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * Frames can also be matched from an array of identifiers. Within a frame, it is acceptable for `@id` to have an array
 * value, where the individual values are treated as IRIs.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#matching-on-id
 */
Deno.test("JSON-LD document framing: matching on id 2", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
  console.log(framedDocument)
})

/**
 * An empty frame matches any node object, even if those objects are embedded elsewhere, causing them to be serialized
 * at the top level.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#empty-frame-0
 */
Deno.test("JSON-LD document framing: empty frame", async () => {
  const frame: JsonLdDocument = {
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

  const framedDocument = await rdfc.frame(flattenedDocument, frame)
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

  const normalizedDocument = await rdfc.normalize(document)
  console.log(normalizedDocument)
})
