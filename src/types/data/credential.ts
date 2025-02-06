import type { DateTime, Type, URI } from "../jsonld/literals.ts"
import type { JsonLdObject } from "../jsonld/base.ts"
import type { LanguageObject } from "../jsonld/objects.ts"
import type { OneOrMany } from "../../mod.ts"
import type { Proof } from "./proof.ts"

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
 *
 * @see https://www.w3.org/TR/vc-data-model-2.0/
 * @see https://www.w3.org/TR/vc-data-model-2.0/#credentials
 * @see https://www.w3.org/TR/vc-data-model-2.0/#verifiable-credentials
 */
export interface Credential extends JsonLdObject {
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
   * @see https://www.w3.org/TR/vc-data-model-2.0/#identifiers
   *
   * @example "urn:uuid:0c07c1ce-57cb-41af-bef2-1b932b986873"
   * @example "https://id.example/things#123"
   * @example "did:example:1234abcd"
   */
  id?: URI

  /**
   * The `type` property is used to determine whether or not a provided verifiable credential or verifiable presentation
   * is appropriate for the intended use-case.
   *
   * The value of the `type` property MUST be one or more terms and absolute URL strings. If more than one value is
   * provided, the order does not matter.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#types
   *
   * @example ["VerifiableCredential", "ExampleDegreeCredential"]
   * @example "VerifiablePresentation"
   */
  type: OneOrMany<Type>

  /**
   * The name of the credential. Ideally, the `name` of a credential is concise, human-readable, and could enable an
   * individual to quickly differentiate one credential from any other credentials they might hold.
   *
   * If present, the value of the `name` property MUST be a string or a language value object.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#names-and-descriptions
   *
   * @example "University Degree"
   * @example
   * ```json
   * [{
   *    "@value": "Example University",
   *    "@language": "en"
   *  }, {
   *    "@value": "Université Exemple",
   *    "@language": "fr"
   * }]
   * ```
   */
  name?: string | OneOrMany<LanguageObject>

  /**
   * The specific details about the credential. Ideally, the `description` of a credential is no more than a few
   * sentences in length and conveys enough information about the credential to remind an individual of its contents
   * without having to look through the entirety of the claims.
   *
   * If present, the value of the `description` property MUST be a string or a language value object.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#names-and-descriptions
   *
   * @example "2015 Bachelor of Science in Mechanical Engineering from Example University"
   * @example
   * ```json
   * [{
   *    "@value": "A public university focusing on teaching examples.",
   *    "@language": "en"
   *  }, {
   *    "@value": "Une université publique axée sur l'enseignement d'exemples.",
   *    "@language": "fr"
   * }]
   * ```
   */
  description?: string | OneOrMany<LanguageObject>

  /**
   * The issuer of the verifiable credential. It is RECOMMENDED that the URL be one which, if dereferenced, results in a
   * controller document about the issuer that can be used to verify the information expressed in the credential.
   *
   * The value of the `issuer` property MUST be either a URL or an object containing an `id` property whose value is a
   * URL; in either case, the issuer selects this URL to identify itself in a globally unambiguous way.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#issuer
   *
   * @example "https://university.example/issuers/14"
   * @example
   * ```json
   * {
   *    "id": "did:example:76e12ec712ebc6f1c221ebfeb1f",
   *    "name": "Example University"
   * }
   * ```
   */
  issuer: URI | Identified

  /**
   * Claims about one or more subjects.
   *
   * The value of the `credentialSubject` property is a set of objects where each object MUST be the subject of one or
   * more claims, which MUST be serialized inside the `credentialSubject` property. Each object MAY also contain an `id`
   * property to identify the subject.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#credential-subject
   *
   * @example
   * ```json
   * {
   *    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
   *    "degree": {
   *      "type": "ExampleBachelorDegree",
   *      "name": "Bachelor of Science and Arts"
   *    }
   * }
   * ```
   * @example
   * ```json
   * [{
   *    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
   *    "name": "Jayden Doe",
   *    "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
   * }, {
   *    "id": "https://subject.example/subject/8675",
   *    "name": "Morgan Doe",
   *    "spouse": "https://subject.example/subject/7421"
   * }]
   * ```
   */
  credentialSubject: OneOrMany<MaybeIdentified>

  /**
   * The date and time when a credential becomes valid. Note that this value represents the earliest point in time at
   * which the information associated with the `credentialSubject` property is considered valid. If a `validUntil` value
   * also exists, the `validFrom` value MUST express a point in time that is temporally the same or earlier than the
   * point in time expressed by the `validUntil` value.
   *
   * If present, the value of the `validFrom` property MUST be a `dateTimeStamp` string value representing the date and
   * time the credential becomes valid, which could be a date and time in the past or future.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#validity-period
   *
   * @example "2010-01-01T19:23:24Z"
   */
  validFrom?: DateTime

  /**
   * The date and time when a credential ceases to be valid. Note that this value represents the latest point in time at
   * which the information associated with the `credentialSubject` property is considered valid. If a `validFrom` value
   * also exists, the `validUntil` value MUST express a point in time that is temporally the same or later than the
   * point in time expressed by the `validFrom` value.
   *
   * If present, the value of the `validUntil` property MUST be a `dateTimeStamp` string value representing the date and
   * time the credential ceases to be valid, which could be a date and time in the past or future.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#validity-period
   *
   * @example "2020-01-01T19:23:24Z"
   */
  validUntil?: DateTime

  /**
   * Information related to the status of a verifiable credential, such as whether it is suspended or revoked. The
   * precise content of the credential status information is determined by the specific `credentialStatus` type
   * definition and varies depending on factors such as whether it is simple to implement or if it is privacy-enhancing.
   * The value will provide enough information to determine the current status of the credential and whether machine-
   * readable information will be retrievable from the URL. For example, the object could contain a link to an external
   * document that notes whether the credential is suspended or revoked.
   *
   * If present, the value of the `status` property is a single object or a set of one or more objects.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#status
   *
   * @example
   * ```json
   * {
   *    "id": "https://university.example/credentials/status/3#94567",
   *    "type": "BitstringStatusListEntry",
   *    "statusPurpose": "revocation",
   *    "statusListIndex": "94567",
   *    "statusListCredential": "https://university.example/credentials/status/3"
   * }
   * ```
   * @example
   * ```json
   * [{
   *    "id": "https://license.example/credentials/status/84#14278",
   *    "type": "BitstringStatusListEntry",
   *    "statusPurpose": "revocation",
   *    "statusListIndex": "14278",
   *    "statusListCredential": "https://license.example/credentials/status/84"
   * }, {
   *    "id": "https://license.example/credentials/status/84#82938",
   *    "type": "BitstringStatusListEntry",
   *    "statusPurpose": "suspension",
   *    "statusListIndex": "82938",
   *    "statusListCredential": "https://license.example/credentials/status/84"
   * }]
   * ```
   */
  credentialStatus?: OneOrMany<Status>

  /**
   * Data schemas are useful when enforcing a specific structure on a given data collection. There are at least two
   * types of data schemas considered:
   *
   *    - Data verification schemas, which are used to establish that the structure and contents of a credential or
   *      verifiable credential conform to a published schema.
   *    - Data encoding schemas, which are used to map the contents of a verifiable credential to an alternative
   *      representation format, such as a format used in a zero-knowledge proof.
   *
   * It is important to understand that data schemas serve a different purpose from the `@context` property, which
   * neither enforces data structure or data syntax nor enables the definition of arbitrary encodings to alternate
   * representation formats.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#data-schemas
   *
   * @example
   * ```json
   * [{
   *    "id": "https://example.org/examples/degree.json",
   *    "type": "JsonSchema"
   * }, {
   *    "id": "https://example.org/examples/alumni.json",
   *    "type": "JsonSchema"
   * }]
   * ```
   */
  credentialSchema?: OneOrMany<Schema>

  /**
   * An embedded proof is a mechanism where the proof is included in the serialization of the data model. The embedded
   * proof secures the original credential by decorating the original data with a digital signature or cryptographic
   * proof. This results in a verifiable credential that is easy to manage in modern programming environments and
   * database systems.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#securing-mechanisms
   *
   * @example
   * ```json
   * {
   *    "type": "DataIntegrityProof",
   *    "cryptosuite": "eddsa-rdfc-2022",
   *    "created": "2021-11-13T18:19:39Z",
   *    "verificationMethod": "https://university.example/issuers/14#key-1",
   *    "proofPurpose": "assertionMethod",
   *    "proofValue": "z58DAdFfa9SkqZMVPxAQp...jQCrfFPP2oumHKtz"
   * }
   * ```
   */
  proof?: OneOrMany<Proof>

  /**
   * It is useful for systems to enable the manual or automatic refresh of an expired verifiable credential. This
   * property enables an issuer to include a link to a refresh service.
   *
   * The issuer can include the refresh service as an element inside the verifiable credential if it is intended for
   * either the verifier or the holder (or both), or inside the verifiable presentation if it is intended for the
   * holder only. In the latter case, this enables the holder to refresh the verifiable credential before creating a
   * verifiable presentation to share with a verifier. In the former case, including the refresh service inside the
   * verifiable credential enables either the holder or the verifier to perform future updates of the credential.
   *
   * The refresh service is only expected to be used when either the credential has expired or the issuer does not
   * publish credential status information. Issuers are advised not to put the `refreshService` property in a verifiable
   * credential that does not contain public information or whose refresh service is not protected in some way.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#refreshing
   *
   * @example
   * ```json
   * {
   *    "type": "VerifiableCredentialRefreshService2021",
   *    "url": "https://registration.provider.example/flows/reissue-age-token",
   *    "refreshToken": "z2BJYfNtmWRiouWhDrbDQmC2zicUPBxsPg"
   * }
   * ```
   */
  refreshService?: OneOrMany<RefreshService>

  /**
   * Terms of use can be used by an issuer or a holder to communicate the terms under which a verifiable credential or
   * verifiable presentation was issued. The issuer places their terms of use inside the verifiable credential. The
   * holder places their terms of use inside a verifiable presentation.
   *
   * The value of the `termsOfUse` property might be used to tell the verifier any or all of the following, among other
   * things:
   *
   *    - the procedures or policies that were used in issuing the verifiable credential, by providing, for example, a
   *      pointer to a public location (to avoid "phone home" privacy issues) where these procedures or policies can be
   *      found, or the name of the standard that defines them.
   *    - the rules and policies of the issuer that apply to the presentation of this verifiable credential to a
   *      verifier, by providing, for example, a pointer to a public location (to avoid "phone home" privacy issues)
   *      where these rules or policies can be found.
   *    - the identity of the entity under whose authority the issuer issued this particular verifiable credential.
   *
   * In the example below, the issuer is asserting that the legal basis under which the verifiable credential has been
   * issued is the "professional qualifications directive" using the "Employment&Life" trust framework, with a specific
   * link to the policy.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#terms-of-use
   *
   * @example
   * ```json
   * {
   *    "type": "TrustFrameworkPolicy",
   *    "trustFramework": "Employment&Life",
   *    "policyId": "https://policy.example/policies/125",
   *    "legalBasis": "professional qualifications directive"
   * }
   * ```
   */
  termsOfUse?: OneOrMany<TermOfUse>

  /**
   * Evidence can be included by an issuer to provide the verifier with additional supporting information in a
   * verifiable credential. This could be used by the verifier to establish the confidence with which it relies on the
   * claims in the verifiable credential. For example, an issuer could check physical documentation provided by the
   * subject or perform a set of background checks before issuing the credential. In certain scenarios, this information
   * is useful to the verifier when determining the risk associated with relying on a given credential.
   *
   * In the example below, the issuer is asserting that they have video of the subject of the credential demonstrating
   * the achievement.
   *
   * @see https://www.w3.org/TR/vc-data-model-2.0/#evidence
   *
   * @example
   * ```json
   * [{
   *    "id": "https://videos.example/training/alice-espresso.mp4",
   *    "type": ["Evidence"],
   *    "name": "Talk-aloud video of double espresso preparation",
   *    "description": "This is a talk-aloud video of Alice demonstrating preparation of a double espresso drink.",
   *    "digestMultibase": "uELq9FnJ5YLa5iAszyJ518bXcnlc5P7xp1u-5uJRDYKvc"
   * }]
   * ```
   */
  evidence?: OneOrMany<Evidence>
}

/**
 * A node object that MUST contain an `id` property whose value is a URI.
 */
interface Identified extends JsonLdObject {
  /**
   * Provide a unique identifier for the object.
   *
   * The `id` property is REQUIRED. Its value MUST be a single URL, which MAY be dereferenceable. It is RECOMMENDED that
   * the URL in the `id` be one which, if dereferenceable, results in a document containing machine-readable information
   * about the `id`.
   */
  id: URI
}

/**
 * A node object that MAY contain an `id` property whose value is a URI.
 */
interface MaybeIdentified extends JsonLdObject {
  /**
   * Provide a unique identifier for the object.
   *
   * The `id` property is OPTIONAL. If present, its value MUST be a single URL, which MAY be dereferenceable. It is
   * RECOMMENDED that the URL in the `id` be one which, if dereferenceable, results in a document containing machine-
   * readable information about the `id`.
   */
  id?: URI
}

/**
 * A status object that contains information related to the status of a verifiable credential.
 */
interface Status extends MaybeIdentified {
  /**
   * Express the type information of the object.
   *
   * The `type` property is REQUIRED. Its value MUST be a single term or an absolute URL string.
   *
   * @example "BitstringStatusListEntry"
   */
  type: OneOrMany<Type>
}

/**
 * A schema object that contains information about the data schema of a verifiable credential.
 */
interface Schema extends Identified {
  /**
   * The type information of the object determining the precise contents of each data schema.
   *
   * The `type` property is REQUIRED. Its value MUST be a single term or an absolute URL string.
   *
   * @example "JsonSchema"
   */
  type: OneOrMany<Type>
}

/**
 * A refresh service object that contains information about the refresh service of a verifiable credential.
 */
interface RefreshService extends JsonLdObject {
  /**
   * The type information of the object determining the precise contents of each refresh service.
   *
   * The `type` property is REQUIRED. Its value MUST be a single term or an absolute URL string.
   *
   * @example "VerifiableCredentialRefreshService2021"
   */
  type: OneOrMany<Type>
}

/**
 * A term of use object that contains information about the terms of use of a verifiable credential.
 */
interface TermOfUse extends MaybeIdentified {
  /**
   * The type information of the object determining the precise contents of each term of use.
   *
   * The `type` property is REQUIRED. Its value MUST be a single term or an absolute URL string.
   *
   * @example "TrustFrameworkPolicy"
   */
  type: OneOrMany<Type>
}

/**
 * An evidence object that contains information about the evidence of a verifiable credential.
 */
interface Evidence extends MaybeIdentified {
  /**
   * The type information of the object determining the precise contents of each evidence.
   *
   * The `type` property is REQUIRED. Its value MUST be a single term or an absolute URL string.
   *
   * @example ["Evidence"]
   */
  type: OneOrMany<Type>
}
