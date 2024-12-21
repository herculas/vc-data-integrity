import type { JsonArray, JsonObject, OneOrMany } from "./base.ts"
import type { Context, Direction, Id, Index, Language, LdSet, List, Primitive, Type } from "./keywords.ts"
import type { NodeObject } from "./node.ts"

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
    "@value": Primitive
    "@language"?: Language
    "@direction"?: Direction
  } | {
    "@value": Primitive
    "@type": Type
  } | {
    "@value": Primitive | JsonObject | JsonArray
    "@type": "@json"
  })

/**
 * A JSON-LD list object represents an ordered list of JSON-LD nodes.
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
