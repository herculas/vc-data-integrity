import type { ContainerType, ContainerTypeCombination, ContextDefinition } from "./misc.ts"
import type { JsonObject, JsonPrimitive, OneOrMany } from "./base.ts"
import type { NodeObject, ValueObject } from "./objects.ts"
import type { URI } from "./literals.ts"

/**
 * Used to set the base IRI against which to resolve those relative IRI references which are otherwise interpreted
 * relative to the document.
 *
 * @see https://www.w3.org/TR/json-ld11/#base-iri
 */
export type Base = URI | null

/**
 * Used to set the default container type for a term.
 */
export type Container = OneOrMany<"@list" | "@set" | ContainerType> | ContainerTypeCombination | null

/**
 * Used to define the short-hand names that are used throughout a JSON-LD document. These short-hand names are called
 * terms and help developers to express specific identifiers in a compact manner.
 *
 * @see https://www.w3.org/TR/json-ld11/#the-context
 */
export type Context = OneOrMany<null | URI | ContextDefinition>

/**
 * Used to set the base direction of a JSON-LD value, which are not typed values (e.g., strings, or language-tagged
 * strings).
 *
 * @see https://www.w3.org/TR/json-ld11/#string-internationalization
 */
export type Direction = "ltr" | "rtl" | null

/**
 * Used to express a graph. A graph is a set of node objects connected by directed-arcs.
 *
 * @see https://www.w3.org/TR/json-ld11/#named-graphs
 */
export type Graph = OneOrMany<NodeObject | ValueObject>

/**
 * Used to uniquely identify node objects that are being described in the document with IRIs or blank node identifiers.
 * A node reference is a node object containing only the `@id` property, which may represent a reference to a node
 * object found elsewhere in the document.
 *
 * @see https://www.w3.org/TR/json-ld11/#node-identifiers
 */
export type Id = OneOrMany<URI>

/**
 * Used in a context definition to load an external context within which the containing context definition is merged.
 */
export type Import = string

/**
 * Used in a top-level node object to define an included block, for including secondary node objects within another
 * node object.
 *
 * An included block is an entry in a node object where the key is either `@included` or an alias of `@included`, and
 * the value is one or more node objects. An included block is used to provide a set of node objects. An included block
 * MAY appear as the value of a member of a node object with either key of `@included` or an alias of `@included`.
 *
 * @see https://www.w3.org/TR/json-ld11/#included-blocks
 */
export type IncludedBlock = OneOrMany<NodeObject>

/**
 * Used to specify that a container is used to index information and that processing should continue deeper into a JSON
 * data structure.
 *
 * @see https://www.w3.org/TR/json-ld11/#data-indexing
 */
export type Index = string

/**
 * Used to specify the language for a particular string value or the default language of a JSON-LD document.
 *
 * @see https://www.w3.org/TR/json-ld11/#string-internationalization
 */
export type Language = string

/**
 * Used to express an ordered set of data.
 *
 * @see https://www.w3.org/TR/json-ld11/#lists
 */
export type List = OneOrMany<JsonPrimitive | NodeObject | ValueObject>

/**
 * Used to define a property of a node object that groups together properties of that node, but is not an edge in the
 * graph.
 */
export type Nest = OneOrMany<JsonObject>

/**
 * With the value `true`, allows this term to be used to construct a compact IRI when compacting. With the value
 * `false`, prevents the term from being used to construct a compact IRI. Also determines if the term will be considered
 * when expanding compact IRIs.
 */
export type Prefix = boolean

/**
 * Used in a context definition to change the scope of that context. By default, it is `true`, meaning that contexts
 * propagate across node objects (other than for type-scoped contexts, which default to `false`). Setting this to
 * `false` causes term definitions created within that context to be removed when entering a new node object.
 */
export type Propagate = boolean

/**
 * Used to prevent term definitions of a context to be overridden by other contexts.
 *
 * @see https://www.w3.org/TR/json-ld11/#protected-term-definitions
 */
export type Protected = boolean

/**
 * Used to express reverse properties.
 *
 * @see https://www.w3.org/TR/json-ld11/#reverse-properties
 */
export type Reverse = string | {
  [key: string]: OneOrMany<string | JsonObject>
}

/**
 * Used to express an unordered set of data and to ensure that values are always represented as arrays.
 *
 * @see https://www.w3.org/TR/json-ld11/#sets
 */
export type LdSet = OneOrMany<JsonPrimitive | NodeObject | ValueObject>

/**
 * Used to set the type of a node or the datatype of a typed value.
 *
 * @see https://www.w3.org/TR/json-ld11/#specifying-the-type
 * @see https://www.w3.org/TR/json-ld11/#typed-values
 */
export type Types = OneOrMany<string>

/**
 * Used in a context definition to set the processing mode.
 */
export type Version = "1.1" | 1.1

/**
 * Used to expand properties and values in `@type` with a common prefix IRI.
 *
 * @see https://www.w3.org/TR/json-ld11/#default-vocabulary
 */
export type Vocab = string | null
