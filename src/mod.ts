// Context URLs
export * as VC_BASE_URL from "./context/url.ts"

// Cryptographic suites
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"
export * as algorithm from "./suite/algorithms.ts"
export * as document from "./suite/document.ts"

// Serialization
export * as jcs from "./serialize/jcs.ts"
export * as jsonld from "./serialize/jsonld.ts"
export * as rdf from "./serialize/rdf.ts"

// Selective disclosure
export * as selective from "./disclose/index.ts"

// Utilities
export * as format from "./utils/format.ts"
export * as guard from "./utils/guard.ts"
export * as instance from "./utils/instance.ts"
export * as loader from "./utils/loader.ts"
export { base58btc, base64url, base64urlnopad } from "./utils/multibase.ts"

// Error handling
export { BasicError, BasicErrorCode } from "./error/basic.ts"
export { ImplementationError, ImplementationErrorCode } from "./error/implement.ts"
export { ProcessingError, ProcessingErrorCode } from "./error/process.ts"

// Options
export type * as DisclosureOptions from "./types/api/disclose.ts"
export type * as DocumentOptions from "./types/api/document.ts"
export type * as JsonLdOptions from "./types/api/jsonld.ts"
export type * as KeypairOptions from "./types/api/keypair.ts"
export type * as RdfOptions from "./types/api/rdf.ts"

// Results and interfaces
export type { LoadDocumentCallback, RemoteDocument } from "./types/api/loader.ts"
export type * as Result from "./types/api/result.ts"

// Data type definitions
export type { CIDDocument, Service } from "./types/data/cid.ts"
export type { Credential } from "./types/data/credential.ts"
export type { Proof } from "./types/data/proof.ts"

export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/data/jwk.ts"
export type {
  VerificationMethod,
  VerificationMethodJwk,
  VerificationMethodMultibase,
  VerificationRelationship,
} from "./types/data/method.ts"

// JSON-LD type definitions
export type { DateTime, DID, DIDURL, IRI, IRIReference, Term, URI, URIReference } from "./types/serialize/base.ts"
export type {
  JsonLdDocument,
  JsonLdObject,
  OneOrMany,
  OneOrWrapped,
  SingleWrapped,
} from "./types/serialize/document.ts"
