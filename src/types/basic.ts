export type OneOrMany<T> = T | Array<T>

/**
 * A JSON-LD node object represents zero or more properties of a node in the graph serialized by the JSON-LD document.
 * @see https://www.w3.org/TR/json-ld11/#node-objects
 */
export interface NodeObject {
  "@context"?: Context
  "@id"?: Id
  "@included"?: IncludedBlock
  "@graph"?: Graph
  "@nest"?: Nest
  "@type"?: Type
  "@reverse"?: Reverse
  "@index"?: Index
  [key: string]:
    | OneOrMany<Primitive | NodeObject | GraphObject | ValueObject | ListObject | SetObject>
    | IncludedBlock
    | LanguageMap
    | IndexMap
    | IdMap
    | TypeMap
    | NodeObject[keyof NodeObject]
}

type DOMString = string
type URL = DOMString
type IRIReference = URL

/**
 * A list of keywords used in JSON-LD documents.
 * @see https://www.w3.org/TR/json-ld11/#keywords
 */
type Base = IRIReference | null
type Container = OneOrMany<"@list" | "@set" | ContainerType> | ContainerTypeCombination | null
export type Context = OneOrMany<string | ContextDefinition>
type Direction = "ltr" | "rtl" | null
type Graph = OneOrMany<NodeObject>
type Id = OneOrMany<string>
type Import = string
type Index = string
type Language = string
type List = OneOrMany<Primitive | NodeObject | ValueObject>
type Nest = OneOrMany<JsonObject>
type Prefix = boolean
type Propagate = boolean
type Protected = boolean
type Reverse = { [key: string]: OneOrMany<string> }
type Set = OneOrMany<Primitive | NodeObject | ValueObject>
type Type = OneOrMany<string>
type Primitive = string | number | boolean | null
type Version = "1.1"
type Vocab = string | null

/**
 * A JSON-LD graph object represents a named graph, which MAY include an explicit graph name.
 * @see https://www.w3.org/TR/json-ld11/#graph-objects
 */
interface GraphObject {
  "@graph": OneOrMany<NodeObject>
  "@index"?: Index
  "@id"?: Id
  "@context"?: Context
}

/**
 * A JSON-LD value object is used to explicitly associate a type or a language with a value to create a typed value or
 * a language-tagged string and possibly associate a base direction.
 * @see https://www.w3.org/TR/json-ld11/#value-objects
 */
type ValueObject =
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
interface ListObject {
  "@list": List
  "@index"?: Index
}

/**
 * A JSON-LD set object represents an unordered set of JSON-LD nodes.
 */
interface SetObject {
  "@set": Set
  "@index"?: Index
}

/**
 * A JSON-LD language map is used to associate a language tag with a string value.
 * @see https://www.w3.org/TR/json-ld11/#language-maps
 */
interface LanguageMap {
  [key: string]: OneOrMany<string> | null
}

/**
 * A JSON-LD index map allows keys that have no semantic meanings, but should be preserved regardless.
 * @see https://www.w3.org/TR/json-ld11/#index-maps
 */
interface IndexMap {
  [key: string]: OneOrMany<Primitive | NodeObject | ValueObject | ListObject | SetObject>
}

/**
 * A JSON-LD ID map is used to associate an IRI with a value.
 * @see https://www.w3.org/TR/json-ld11/#id-maps
 */
interface IdMap {
  [key: string]: NodeObject
}

/**
 * A JSON-LD type map is used to associate a type with a value.
 */
interface TypeMap {
  [key: string]: string | NodeObject
}

/**
 * A JSON-LD included block is used to provide a set of node objects that are to be included in the graph.
 * @see https://www.w3.org/TR/json-ld11/#included-blocks
 */
type IncludedBlock = OneOrMany<NodeObject>

/**
 * A JSON-LD context definition defines a local context in a node object.
 * @see https://www.w3.org/TR/json-ld11/#context-definitions
 */
interface ContextDefinition {
  "@base"?: Base
  "@direction"?: Direction
  "@import"?: Import
  "@language"?: Language
  "@propagate"?: Propagate
  "@protected"?: Protected
  "@version"?: Version
  "@vocab"?: Vocab
  "@type"?: {
    "@container": "@set"
    "@protected"?: Protected
  }
  [key: string]: null | string | ExpandedTermDefinition | ContextDefinition[keyof ContextDefinition]
}

/**
 * An expanded term definition is used to describe the mapping between a term and its expanded identifier, as well as
 * other properties of the value associated with the term when it is used as key in a node object.
 * @see https://www.w3.org/TR/json-ld11/#expanded-term-definition
 */
type ExpandedTermDefinition =
  & {
    "@type"?: "@id" | "@json" | "@vocab" | "@none" | string
    "@language"?: Language
    "@index"?: Index
    "@context"?: ContextDefinition
    "@prefix"?: Prefix
    "@propagate"?: Propagate
    "@protected"?: Protected
  }
  & ({
    "@id"?: Id | null
    "@nest"?: "@nest" | string
    "@container"?: Container
  } | {
    "@reverse": Reverse
    "@container"?: "@set" | "@index" | null
  })

type ContainerType = "@language" | "@index" | "@id" | "@graph" | "@type"
type ContainerTypeCombination =
  | ["@graph", "@id"]
  | ["@id", "@graph"]
  | ["@set", "@graph", "@id"]
  | ["@set", "@id", "@graph"]
  | ["@graph", "@set", "@id"]
  | ["@id", "@set", "@graph"]
  | ["@graph", "@id", "@set"]
  | ["@id", "@graph", "@set"]
  | ["@set", ContainerType]
  | [ContainerType, "@set"]

type JsonValue = Primitive | JsonObject | JsonArray
interface JsonArray extends Array<JsonValue> {}
interface JsonObject {
  [key: string]: JsonValue | undefined
}
