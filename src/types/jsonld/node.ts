import type { OneOrMany } from "./base.ts"
import type { Context, Graph, Id, IncludedBlock, Index, Nest, Scalar, Reverse, Types } from "./keywords.ts"
import type { IdMap, IndexMap, LanguageMap, TypeMap } from "./maps.ts"
import type { GraphObject, ListObject, SetObject, ValueObject } from "./objects.ts"

/**
 * A node object represents zero or more properties of a node in the graph serialized by the JSON-LD document.
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
