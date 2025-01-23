import type { OneOrMany } from "../../mod.ts"
import type { Type } from "../jsonld/base.ts"
import type { URI } from "../jsonld/document.ts"
import type { LanguageObject, NodeObject } from "../jsonld/objects.ts"
import { Proof } from "./proof.ts"

/**
 * Verifiable credentials are used to express properties of one or more subjects as well as properties of the credential
 * itself.
 *
 * A verifiable credential is a set of one or more claims made by the same entity. Credentials might also include an
 * identifier and metadata to describe properties of the credential, such as the issuer, the validity data and time
 * period, a representative image, verification material, status information, and so on. A verifiable credential is a
 * set of tamper-evident claims and metadata that cryptographically prove who issued it.
 *
 * Examples of verifiable credentials include, but not limited to, digital employee identification cards, digital
 * driver's licenses, and digital educational certificates.
 */
export interface Credential extends NodeObject {
  /**
   * The `id` property allows for expressing statements about specific things in the verifiable credential and is set by
   * an issuer when expressing objects in a verifiable credential or a holder when expressing objects in a verifiable
   * presentation.
   *
   * The `id` property expresses an identifier that others are expected to use when expressing statements about the
   * specific thing identified by that identifier. Example `id` values include UUIDs, HTTP URLs, and DIDs.
   *
   * The `id` property is OPTIONAL. If present, its value MUST be a single URL, which MAY be dereferenceable. It is
   * RECOMMENDED that the URL in the `id` be one which, if dereferenceable, results in a document containing machine-
   * readable information about the `id`.
   *
   * @example
   * - "urn:uuid:0c07c1ce-57cb-41af-bef2-1b932b986873"
   * - "https://id.example/things#123"
   * - "did:example:1234abcd"
   */
  id?: URI

  /**
   * The `type` property is used to determine whether or not a provided verifiable credential or verifiable presentation
   * is appropriate for the intended use-case.
   *
   * The value of the `type` property MUST be one or more terms and absolute URL strings. If more than one value is
   * provided, the order does not matter.
   *
   * @example
   * - ["VerifiableCredential", "ExampleDegreeCredential"]
   * - "VerifiablePresentation"
   */
  type: OneOrMany<Type>

  /**
   * The name of the credential. If present, the value of the `name` property MUST be a string or a language value
   * object. Ideally, the `name` of a credential is concise, human-readable, and could enable an individual to quickly
   * differentiate one credential from any other credentials they might hold.
   */
  name?: string | OneOrMany<LanguageObject>

  /**
   * The specific details about the credential. If present, the value of the `description` property MUST be a string or
   * a language value object. Ideally, the `description` of a credential is no more than a few sentences in length and
   * conveys enough information about the credential to remind an individual of its contents without having to look
   * through the entirety of the claims.
   */
  description?: string | OneOrMany<LanguageObject>

  issuer: string
  credentialSubject: string

  validFrom?: string
  validUntil?: string
  status?: string
  credentialSchema?: string

  proof?: OneOrMany<Proof>

  refreshService?: string
  termsOfUse?: string
  evidence?: string
  
}
