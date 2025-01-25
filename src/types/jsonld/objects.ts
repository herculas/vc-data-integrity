import type { JsonArray, JsonObject, OneOrMany, Scalar } from "./base.ts"
import type {
  Context,
  Direction,
  Graph,
  Id,
  IncludedBlock,
  Index,
  Language,
  LdSet,
  List,
  Nest,
  Reverse,
  Types,
} from "./keywords.ts"
import type { IdMap, IndexMap, LanguageMap, TypeMap } from "./maps.ts"

/**
 * A node object represents zero or more properties of a node in the graph serialized by the JSON-LD document. A map is
 * a node object if it exists outside of the JSON-LD context and:
 *
 *    - it does not contain the `@value`, `@list`, or `@set` keywords, or
 *    - it is not the top-most map in the JSON-LD document consisting of no other entries than `@graph` and `@context`.
 *
 * The entries of a node object whose keys are not keywords are also called properties of the node object.
 *
 * @see https://www.w3.org/TR/json-ld11/#node-objects
 */
export interface NodeObject {
  "@context"?: Context
  "@id"?: Id
  "@included"?: IncludedBlock
  "@graph"?: Graph
  "@nest"?: Nest
  "@type"?: Types
  "@reverse"?: Reverse
  "@index"?: Index
  [key: string]:
    | OneOrMany<Scalar | NodeObject | GraphObject | ValueObject | ListObject | SetObject>
    | IncludedBlock
    | LanguageMap
    | IndexMap
    | IdMap
    | TypeMap
    | NodeObject[keyof NodeObject]
}

/**
 * A JSON-LD graph object represents a named graph, which MAY include an explicit graph name.
 *
 * @see https://www.w3.org/TR/json-ld11/#graph-objects
 */
export interface GraphObject {
  "@graph": OneOrMany<NodeObject>
  "@index"?: Index
  "@id"?: Id
  "@context"?: Context
}

/**
 * A JSON-LD value object is used to explicitly associate a type or a language with a value to create a typed value or
 * a language-tagged string and possibly associate a base direction.
 *
 * @see https://www.w3.org/TR/json-ld11/#value-objects
 */
export type ValueObject =
  & {
    "@index"?: Index
    "@context"?: Context
  }
  & ({
    "@value": Scalar
    "@language"?: Language
    "@direction"?: Direction
  } | {
    "@value": Scalar
    "@type": Types
  } | {
    "@value": Scalar | JsonObject | JsonArray
    "@type": "@json"
  })

/**
 * A list object is a map that has a `@list` key. It may also have an `@index` key, but no other entries.
 *
 * @see https://www.w3.org/TR/json-ld11/#lists-and-sets
 */
export interface ListObject {
  "@list": List
  "@index"?: Index
}

/**
 * A JSON-LD set object represents an unordered set of JSON-LD nodes.
 */
export interface SetObject {
  "@set": LdSet
  "@index"?: Index
}

/**
 * A language object is used to associate a language tag with a string value.
 */
export interface LanguageObject {
  "@value": Scalar
  "@language"?: Language
  "@direction"?: Direction
}