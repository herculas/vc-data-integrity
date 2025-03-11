// Context URLs
export * as VC_BASE_URL from "./context/url.ts"

// Selective disclosure
export * as selective from "./disclose/index.ts"

// Error handling
export { BasicError, BasicErrorCode } from "./error/basic.ts"
export { ImplementationError, ImplementationErrorCode } from "./error/implement.ts"
export { ProcessingError, ProcessingErrorCode } from "./error/process.ts"

// Serialization
export * as jcs from "./serialize/jcs.ts"
export * as rdfc from "./serialize/rdfc.ts"

// Cryptographic suites
export { Cryptosuite } from "./suite/cryptosuite.ts"
export { Keypair } from "./suite/keypair.ts"
export * as algorithm from "./suite/algorithms.ts"
export * as document from "./suite/document.ts"

// Utilities
export * as format from "./utils/format.ts"
export * as guard from "./utils/guard.ts"
export * as instance from "./utils/instance.ts"
export * as loader from "./utils/loader.ts"
export * as multi from "./utils/multibase.ts"

// Interfaces and parameters
export type { Hasher, HMAC, LabelMap, LabelMapFactory, Path } from "./types/api/disclose.ts"
export type { Flag, Relationship, Validation, Verification, VerificationCombined } from "./types/api/suite.ts"

// Data type definitions
export type { CIDDocument, Service } from "./types/data/cid.ts"
export type { Credential } from "./types/data/credential.ts"
export type { JWK, JWKEC, JWKOct, JWKRSA, JWKSet, OtherPrimeInfo } from "./types/data/jwk.ts"
export type {
  VerificationMethod,
  VerificationMethodJwk,
  VerificationMethodMultibase,
  VerificationRelationship,
} from "./types/data/method.ts"
export type { Proof } from "./types/data/proof.ts"

// Options
export type { LoadProfile } from "./types/options/load.ts"
export type { Canonize, Compact, Expand, Flatten, Frame, Normalize, ToRdf } from "./types/options/serialize.ts"
export type { Export, Import, Retrieve } from "./types/options/suite.ts"

// JSON-LD type definitions
export type {
  BlankNode,
  DateTime,
  DID,
  DIDURL,
  IRI,
  IRICompacted,
  IRIReference,
  Term,
  URI,
  URIReference,
  URNScheme,
} from "./types/serialize/base.ts"
export type {
  JsonArray,
  JsonLdDocument,
  JsonLdObject,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  OneOrMany,
  OneOrWrapped,
  SingleWrapped,
} from "./types/serialize/document.ts"
export type { LoadDocumentCallback, RemoteDocument } from "./types/serialize/loader.ts"
export type { NQuad, RdfDataset, RdfLiteral, RdfTerm, RdfTriple, TermType } from "./types/serialize/rdf.ts"
