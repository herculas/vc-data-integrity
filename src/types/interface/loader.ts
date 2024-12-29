import type { URL } from "../jsonld/document.ts"

export type LoadedDocument = {
  contextUrl?: URL
  documentUrl?: URL
  document?: object
}

export type Loader = (url: URL) => Promise<LoadedDocument>
