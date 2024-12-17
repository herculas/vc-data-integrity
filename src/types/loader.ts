export type LoadedDocument = {
  contextUrl?: string
  documentUrl?: string
  document?: object
}

export type Loader = (url: string) => Promise<LoadedDocument>
