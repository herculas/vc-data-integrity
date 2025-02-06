// Cryptographic suites
export * as VC_BASE_URL from "./context/url.ts"
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"

// Error handling
export { DataIntegrityError } from "./error/error.ts"
export { ErrorCode } from "./error/code.ts"

// Utilities
export * as hash from "./utils/hash.ts"
export * as jsonld from "./utils/jsonld.ts"
export * as controlled from "./utils/controlled.ts"
export { concatenate, severalToMany } from "./utils/format.ts"
export { defaultLoader, extendLoader } from "./utils/loader.ts"
export { toW3CTimestampString } from "./utils/time.ts"

// Interfaces, options, and results
export type * as DocumentOptions from "./types/api/document.ts"
export type * as JsonLdOptions from "./types/api/jsonld.ts"
export type * as KeypairOptions from "./types/api/keypair.ts"
export type * as Result from "./types/api/result.ts"
export type { Loader, RemoteDocument } from "./types/api/loader.ts"

// Data type definitions
export type { CIDDocument, Service } from "./types/data/cid.ts"
export type { Credential } from "./types/data/credential.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/data/jwk.ts"
export type { Proof } from "./types/data/proof.ts"
export type {
  VerificationMethod,
  VerificationMethodJwk,
  VerificationMethodMultibase,
  VerificationRelationship,
} from "./types/data/method.ts"

// JSON-LD type definitions
export type { Frame, JsonLdDocument, JsonLdObject, OneOrMany } from "./types/jsonld/base.ts"
export type { DateTime, DID, DIDURL, Type, URI } from "./types/jsonld/literals.ts"
