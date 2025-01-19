import type { OneOrMany } from "./base.ts"
import type { Scalar } from "./keywords.ts"
import type { NodeObject } from "./node.ts"
import type { ListObject, SetObject, ValueObject } from "./objects.ts"

/**
 * A language map is used to associate a language tag with a value. The keys of a language map MUST be strings
 * representing language tags as defined in [BCP47]. The values MUST be a string, an array of strings, or null.
 *
 * @see https://www.w3.org/TR/json-ld11/#language-maps
 * @see https://www.w3.org/TR/json-ld11/#string-internationalization
 */
export interface LanguageMap {
  [key: string]: OneOrMany<string> | null
}

/**
 * A index map allows keys that have no semantic meanings, but should be preserved regardless.
 *
 * @see https://www.w3.org/TR/json-ld11/#index-maps
 * @see https://www.w3.org/TR/json-ld11/#data-indexing
 */
export interface IndexMap {
  [key: string]: OneOrMany<Scalar | NodeObject | ValueObject | ListObject | SetObject>
}

/**
 * A ID map is used to associate an IRI with a value.
 *
 * @see https://www.w3.org/TR/json-ld11/#id-maps
 */
export interface IdMap {
  [key: string]: NodeObject
}

/**
 * A type map is used to associate a IRI with a value.
 */
export interface TypeMap {
  [key: string]: string | NodeObject
}
