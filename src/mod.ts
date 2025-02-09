// Context URLs
export * as VC_BASE_URL from "./context/url.ts"

// Cryptographic suites
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"

// Error handling
export { BasicError, BasicErrorCode } from "./error/basic.ts"
export { ImplementationError, ImplementationErrorCode } from "./error/implement.ts"
export { ProcessingError, ProcessingErrorCode } from "./error/process.ts"

// Utilities
export * as document from "./utils/document.ts"
export * as format from "./utils/format.ts"
export * as jsonld from "./utils/jsonld.ts"
export * as loader from "./utils/loader.ts"
export * as instance from "./utils/instance.ts"

// Options
export type * as DocumentOptions from "./types/api/document.ts"
export type * as JsonLdOptions from "./types/api/jsonld.ts"
export type * as KeypairOptions from "./types/api/keypair.ts"

// Results
export type * as Result from "./types/api/result.ts"

// Interfaces
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
