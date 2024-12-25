// contexts and URLs
export * as CONTEXT_CONSTANTS from "./context/constants.ts"
export { URL_CONTEXT_MAP } from "./context/context.ts"

// cryptographic keypairs
export { Keypair } from "./key/keypair.ts"

// document loaders
export { defaultLoader } from "./loader/default.ts"
export { extend } from "./loader/extend.ts"

// linked data proof purposes
export { Purpose } from "./purpose/purpose.ts"

// cryptographic suites
export { Suite } from "./suite/suite.ts"
export { Signature } from "./suite/signature.ts"

// utilities
export { sha256 } from "./utils/crypto.ts"
export { concatenate, severalToMany } from "./utils/format.ts"
export { canonize } from "./utils/jsonld.ts"
export { toW3CTimestampString } from "./utils/time.ts"

// interfaces
export type { LoadedDocument, Loader } from "./types/interface/loader.ts"
export type {
  Export as KeypairExportOptions,
  Import as KeypairImportOptions,
  Purpose as PurposeOptions,
  Suite as SuiteOptions,
} from "./types/interface/options.ts"
export type { VerificationResult } from "./types/interface/suite.ts"

// DID type definitions
export type { DIDDocument } from "./types/did/document.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/did/jwk.ts"
export type { DID, DIDURL } from "./types/did/keywords.ts"
export type { VerificationMethod, VerificationMethodMap } from "./types/did/method.ts"
export type { Service } from "./types/did/service.ts"

// JSON-LD type definitions
export type { OneOrMany } from "./types/jsonld/base.ts"
export type { JsonLdDocument, PlainDocument } from "./types/jsonld/document.ts"
export type { ContextURL, DOMString, IRIReference, Type, URL } from "./types/jsonld/keywords.ts"
export type { NodeObject } from "./types/jsonld/node.ts"
export type { Proof } from "./types/jsonld/proof.ts"
