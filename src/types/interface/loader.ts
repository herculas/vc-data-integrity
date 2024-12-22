import type { URL } from "../jsonld/keywords.ts"

export type LoadedDocument = {
  contextUrl?: URL
  documentUrl?: URL
  document?: object
}

export type Loader = (url: URL) => Promise<LoadedDocument>
