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

// json-ld operations
export { canonize } from "./jsonld/canonize.ts"
export { frame } from "./jsonld/frame.ts"

// utilities
export { sha256 } from "./utils/crypto.ts"
export { concatenate, severalToMany } from "./utils/format.ts"
export { toW3CTimestampString } from "./utils/time.ts"

// interfaces and options
export type { CanonizeOptions } from "./types/interface/jsonld.ts"
export type { KeypairDocument, KeypairExportOptions, KeypairImportOptions } from "./types/interface/keypair.ts"
export type { LoadedDocument, Loader } from "./types/interface/loader.ts"
export type { PurposeOptions } from "./types/interface/purpose.ts"
export type { SuiteOptions, VerificationResult } from "./types/interface/suite.ts"
export type { Proof } from "./types/interface/proof.ts"

// DID type definitions
export type { DIDDocument } from "./types/did/document.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/did/jwk.ts"
export type { DID, DIDURL } from "./types/did/keywords.ts"
export type { VerificationMethod, VerificationMethodMap } from "./types/did/method.ts"
export type { Service } from "./types/did/service.ts"

// JSON-LD type definitions
export type { OneOrMany, Type } from "./types/jsonld/base.ts"
export type { Frame, IRI, JsonLdDocument, PlainDocument, URI } from "./types/jsonld/document.ts"
