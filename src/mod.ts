// cryptographic suites
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"

// utilities
export { sha256 } from "./utils/crypto.ts"
export { concatenate, severalToMany } from "./utils/format.ts"
export { toW3CTimestampString } from "./utils/time.ts"
export { defaultLoader, extendLoader } from "./utils/loader.ts"
export { canonize, frame } from "./utils/jsonld.ts"

// interfaces and options
export type { CanonizeOptions } from "./types/interface/jsonld.ts"
export type { KeypairExportOptions, KeypairImportOptions } from "./types/interface/keypair.ts"
export type { LoadedDocument, Loader } from "./types/interface/loader.ts"
export type { SuiteOptions, VerificationResult } from "./types/interface/suite.ts"
export type { Proof } from "./types/did/proof.ts"

// DID type definitions
export type { CIDDocument, Service } from "./types/did/cid.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/did/jwk.ts"
export type { DID, DIDURL } from "./types/did/keywords.ts"
export type {
  VerificationMethod,
  VerificationMethodJwk,
  VerificationMethodMultibase,
  VerificationMethodRef,
} from "./types/did/method.ts"

// JSON-LD type definitions
export type { DateTime, OneOrMany, Type } from "./types/jsonld/base.ts"
export type { Frame, IRI, JsonLdDocument, PlainDocument, URI } from "./types/jsonld/document.ts"
