import type { OneOrMany } from "../jsonld/base.ts"
import type { Type, URL } from "../jsonld/keywords.ts"

export interface Service {
  id: URL
  type: Type
  serviceEndpoint: OneOrMany<URL>
}
