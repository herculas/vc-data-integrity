// Cryptographic suites
export * as VC_BASE_URL from "./context/url.ts"
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"
export type { CreateOptions, VerificationResult, VerifyOptions } from "./suite/cryptosuite.ts"
export type { ExportOptions, ImportOptions, KeyFlag } from "./suite/keypair.ts"

// Utilities
export { sha256 } from "./utils/crypto.ts"
export { concatenate, includeContext, severalToMany } from "./utils/format.ts"
export { toW3CTimestampString } from "./utils/time.ts"
export { defaultLoader, extendLoader } from "./utils/loader.ts"
export { canonize, frame } from "./utils/jsonld.ts"
export type { LoadedDocument, Loader } from "./utils/loader.ts"

// DID type definitions
export type { CIDDocument, Service } from "./types/did/cid.ts"
export type { Credential } from "./types/did/credential.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/did/jwk.ts"
export type { Proof } from "./types/did/proof.ts"
export type {
  VerificationMethod,
  VerificationMethodJwk,
  VerificationMethodMultibase,
  VerificationMethodRef,
} from "./types/did/method.ts"

// JSON-LD type definitions
export type { OneOrMany } from "./types/jsonld/base.ts"
export type { Frame, JsonLdDocument, PlainDocument } from "./types/jsonld/document.ts"
export type { DateTime, DID, DIDURL, Type, URI } from "./types/jsonld/literals.ts"
