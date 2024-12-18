import type { JsonObject, OneOrMany } from "./base.ts"
import type { ContainerType, ContainerTypeCombination, ContextDefinition } from "./misc.ts"
import type { NodeObject } from "./node.ts"
import type { ValueObject } from "./objects.ts"

/**
 * A list of keywords used in JSON-LD documents.
 * @see https://www.w3.org/TR/json-ld11/#keywords
 */
export type Base = IRIReference | null
export type Container = OneOrMany<"@list" | "@set" | ContainerType> | ContainerTypeCombination | null
export type Context = OneOrMany<ContextURL | ContextDefinition>
export type Direction = "ltr" | "rtl" | null
export type Graph = OneOrMany<NodeObject>
export type Id = OneOrMany<URL>
export type Import = string
export type Index = string
export type Language = string
export type List = OneOrMany<Primitive | NodeObject | ValueObject>
export type Nest = OneOrMany<JsonObject>
export type Prefix = boolean
export type Propagate = boolean
export type Protected = boolean
export type Reverse = { [key: string]: OneOrMany<string> }
export type LdSet = OneOrMany<Primitive | NodeObject | ValueObject>
export type Type = OneOrMany<string>
export type Primitive = string | number | boolean | null
export type Version = "1.1"
export type Vocab = string | null

/**
 * An included block is used to provide a set of node objects. An included block MAY appear as the value of a member 
 * of a node object with either key of `@included` or an alias of `@included`.
 * 
 * @see https://www.w3.org/TR/json-ld11/#included-blocks
 */
export type IncludedBlock = OneOrMany<NodeObject>

export type DOMString = string
export type URL = DOMString

export type IRIReference = URL
export type ContextURL = URL