import type { ListObject, NodeObject, SetObject, ValueObject } from "./objects.ts"
import type { OneOrMany, JsonPrimitive } from "./base.ts"

/**
 * A language map is a map value of a term defined with `@container` set to `@language`, whose keys MUST be strings
 * representing [BCP47](https://www.rfc-editor.org/info/bcp47) language codes and the values MUST be any of the
 * following types: null, string, or an array of zero or more of the above possibilities.
 *
 * @see https://www.w3.org/TR/json-ld11/#language-maps
 * @see https://www.w3.org/TR/json-ld11/#string-internationalization
 */
export interface LanguageMap {
  [key: string]: OneOrMany<string> | null
}

/**
 * An index map is a map value of a form defined with `@container` set to `@index`, whose values MUST be any of the
 * following types: string, number, boolean, null, node object, value object, list object, set object, or an array of
 * zero or more of the above possibilities.
 *
 * An index map allows keys that have no semantic meanings, but should be preserved regardless.
 *
 * @see https://www.w3.org/TR/json-ld11/#index-maps
 * @see https://www.w3.org/TR/json-ld11/#data-indexing
 */
export interface IndexMap {
  [key: string]: OneOrMany<JsonPrimitive | NodeObject | ValueObject | ListObject | SetObject>
}

/**
 * An id map is used to associate an IRI with a value. An id map may be used as a term value within a node object if the
 * term is defined with `@container` set to `@id`, or an array containing both `@id` and `@set`. The keys of an id map
 * MUST be IRIs (IRI references or compact IRIs), the keyword `@none`, or a term expands to `@none`, and the values MUST
 * be node objects.
 *
 * @see https://www.w3.org/TR/json-ld11/#id-maps
 */
export interface IdMap {
  [key: string]: NodeObject
}

/**
 * A type map is a map value of a term defined with `@container` set to `@type`, whose keys are interpreted as IRIs
 * representing the `@type` of the associated node object; the value MUST be a node object, or array of node objects.
 * If the value contains a term expanding to `@type`, its values are merged with the map value when expanding.
 *
 * @see https://www.w3.org/TR/json-ld11/#type-maps
 */
export interface TypeMap {
  [key: string]: string | NodeObject
}
