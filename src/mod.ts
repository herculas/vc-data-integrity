// contexts and constants
export * as CONTEXT_CONSTANTS from "./context/constants.ts"
export { urlContextMap } from "./context/context.ts"

// cryptographic keypairs
export { Keypair } from "./key/keypair.ts"

// document loaders
export { defaultLoader } from "./loader/default.ts"
export { extend } from "./loader/extend.ts"
export type { Loader } from "./types/interface/loader.ts"

// linked data proof purposes
export { Purpose } from "./purpose/purpose.ts"

// cryptographic suites
export { Suite } from "./suite/suite.ts"
export { Signature } from "./suite/signature.ts"
export type { Proof } from "./types/jsonld/proof.ts"
export type { VerificationResult } from "./types/interface/suite.ts"

// types and interfaces
export type { DIDDocument } from "./types/did/document.ts"
export type { DID, DIDURL } from "./types/did/keywords.ts"
export type { MethodMap, VerificationMethod } from "./types/did/method.ts"

export type { OneOrMany } from "./types/jsonld/base.ts"
export type { ContextURL, DOMString, IRIReference, Type, URL } from "./types/jsonld/keywords.ts"
export type { JsonLdDocument, PlainDocument } from "./types/jsonld/document.ts"

// utilities
export { sha256 } from "./utils/crypto.ts"
export { concatenate, severalToMany } from "./utils/format.ts"
export { canonize } from "./utils/jsonld.ts"
export { toW3CTimestampString } from "./utils/time.ts"
