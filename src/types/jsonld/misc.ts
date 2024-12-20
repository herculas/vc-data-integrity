import type {
  Base,
  Container,
  Direction,
  Id,
  Import,
  Index,
  Language,
  Prefix,
  Propagate,
  Protected,
  Reverse,
  Version,
  Vocab,
} from "./keywords.ts"

/**
 * A context definition defines a local context in a node object.
 *
 * @see https://www.w3.org/TR/json-ld11/#context-definitions
 */
export interface ContextDefinition {
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
 *
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

export type ContainerType = "@language" | "@index" | "@id" | "@graph" | "@type"
export type ContainerTypeCombination =
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
