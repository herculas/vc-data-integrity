# Algorithms

The algorithms defined below operate on documents represented as JSON objects. An **unsecured data document** is a map
that contains no proof values. An **input document** is an map that has not yet had the current proof added to it, but
it MAY contain a proof value that was added to it by a previous process. A **secured data document** is a map that
contains one or more proof values.

Implementers MAY implement reasonable defaults and safeguards in addition to the algorithms below, to help mitigate
developer error, excessive resource consumption, newly discovered attack models against which there is a particular
protection, and other improvements. The algorithms provided below are the minimum requirements for an interoperable
implementation, and developers are urged to include additional measures that could contribute to a safer and more
efficient ecosystem.

## Processing Model

The processing model used by a conforming processor and its application-specific software is described in this section.
When a software is to ensure information is tamper-evident, it performs the following steps:

1. The software arranges the information into a document, such as a JSON or JSON-LD document.
2. If the document is a JSON-LD document, the software selects one or more JSON-LD Contexts and expresses them using the
   `@context` property.
3. The software selects one or more cryptography suites that meet the needs of the use case, such as one that provides
   full, selective, or unlinkable disclosure, using acceptable cryptographic key material.
4. The software uses the applicable algorithm(s) provided in Section [Add Proof](#add-proof) or Section
   [Add Proof Set/Chain](#add-proof-setchain) to add one or more proofs.

When software needs to use information that was transmitted to it using a mechanism described by this specification, it
performs the following steps:

1. The software transforms the incoming data into a document that can be understood by the applicable algorithm provided
   in Section [Verify Proof](#verify-proof) or Section [Verify Proof Sets and Chains](#verify-proof-sets-and-chains).
2. The software uses JSON Schema or an equivalent mechanism to validate that the incoming document follows an expected
   schema used by the application.
3. The software uses the applicable algorithm(s) provided in Section [Verify Proof](#verify-proof) or Section
   [Verify Proof Sets and Chains](#verify-proof-sets-and-chains) to verify the integrity of the incoming document.
4. If the document is a JSON-LD document, the software uses the algorithm provided in Section
   [Context Validation](#context-validation), or one providing equivalent protections, to validate all JSON-LD Context
   values used in the document.

## Add Proof

The following algorithm specifies how a digital proof can be added to an input document, and can then be used to verify
the output document's authenticity and integrity. Required inputs are an input document (a map `inputDocument`), a
cryptographic suite instance (an struct `cryptosuite`), and a set of options (a map `options`). Output is a secured data
document (a map) or an error. Whenever this algorithm encodes strings, it MUST use UTF-8 encoding.

1. Let proof be the result of calling the `createProof()` algorithm specified in `cryptosuite.createProof()` with
   `inputDocument` and `options` passed as parameters. If the algorithm produces an error, the error MUST be propagated
   and SHOULD convey the error type.
2. If one or more of the `proof.type`, `proof.verificationMethod`, and `proof.proofPurpose` values is not set, an error
   MUST be raised and SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
3. If `options` has a non-null `domain` item, it MUST be equal to `proof.domain` or an error MUST be raised and SHOULD
   convey an error type of `PROOF_GENERATION_ERROR`.
4. If `options` has a non-null `challenge` item, it MUST be equal to `proof.challenge` or an error MUST be raised and
   SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
5. Let `securedDataDocument` be a copy of `inputDocument`.
6. Set `securedDataDocument.proof` to the value of `proof`.
7. Return `securedDataDocument` as the secured data document.

## Add Proof Set/Chain

The following algorithm specifies how to incrementally add a proof to a proof set or proof chain starting with a secured
document containing either a proof or proof set/chain. Required inputs are a secured data document (a map
`securedDocument`), a cryptographic suite (an struct `cryptosuite`), and a set of options (a map `options`). Output is a
new secured data document (a map). Whenever this algorithm encodes strings, it MUST use UTF-8 encoding.

1. Let `proof` be set to `securedDocument.proof`. Let `allProofs` be an empty list. If `proof` is a list, copy all the
   elements of `proof` to `allProofs`. If `proof` is an object, add a copy of that object to `allProofs`.
2. Let the `inputDocument` be a copy of the `securedDocument` with the `proof` attribute removed. Let `output` be a copy
   of the `inputDocument`.
3. Let `matchingProofs` be an empty list.
4. If `options` has a `previousProof` item that is a string, add the element from `allProofs` with an `id` attribute
   matching `previousProof` to `matchingProofs`. If a proof with `id` equal to `previousProof` does not exist in
   `allProofs`, an error MUST be raised and SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
5. If `options` has a `previousProof` item that is an array, add each element from `allProofs` with an `id` attribute
   that matches an element of that array. If any element of `previousProof` list has an `id` attribute that does not
   match the `id` attribute of any element of `allProofs`, an error MUST be raised and SHOULD convey an error type of
   `PROOF_GENERATION_ERROR`.
6. Set `inputDocument.proof` to `matchingProofs`.

   > NOTE: This step protects the document and existing proofs
   >
   > This step adds reference to the named graphs, as well as adding a copy of _all_ the claims contained in the proof
   > graphs. The step is critical, as it "binds" any matching proofs to the document prior to applying the current
   > proof. The `proof` value for the document will be updated in a later step of this algorithm.

7. Run steps 1 through 6 of the algorithm in Section [Add Proof](#add-proof), passing `inputDocument`, `suite`, and
   `options`. If no exceptions are raised, append the generated `proof` value to the `allProofs`; otherwise, raise the
   exception.
8. Set `output.proof` to the value of `allProofs`.
9. Return `output` as the new secured data document.

## Verify Proof

The following algorithm specifies how to check the authenticity and integrity of a secured data document by verifying
its digital proof. The algorithm takes as input:

- `mediaType`: a media type as defined in the [MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/).
- `documentBytes`: a byte sequence whose media type is `mediaType`.
- `cryptosuite`: a cryptographic suite instance.
- `expectedProofPurpose`: an optional string, used to ensure that the `proof` was generated by the proof creator for the
  expected reason by the verifier.
- `domain`: an optional set of strings, used by the proof creator to lock a proof to a particular security domain, and
  used by the verifier to ensure that a proof is not being used across different security domains.
- `challenge`: an optional string challenge, used by the verifier to ensure that an attacker is not replaying previously
  created proofs.

This algorithm returns a **verification result**, a struct whose items are:

- `verified`: `true` or `false`.
- `verifiedDocument`: `null` if `verified` is `false`; otherwise, an input document.
- `mediaType`: `null` if `verified` is `false`; otherwise, a media type, which MAY include parameters.
- `warnings`: a list of problem details, which defaults to an empty list.
- `errors`: a list of problem details, which defaults to an empty list.

When a step says "an error MUST be raised", it means that a verification result MUST be returned with a `verified` value
of `false` and a non-empty `errors` list.

1. Let `securedDocument` be the result of running parse JSON bytes to an Infra value on `documentBytes`.
2. If either `securedDocument` is not a map or `securedDocument.proof` is not a map, an error MUST be raised and SHOULD
   convey an error type of `PARSING_ERROR`.
3. Let `proof` be `securedDocument.proof`.
4. If one or more of `proof.type`, `proof.verificationMethod`, and `proof.proofPurpose` does not exist, an error MUST be
   raised and SHOULD convey an error type of `PROOF_VERIFICATION_ERROR`.
5. If `expectedProofPurpose` was given, and it does not match `proof.proofPurpose`, an error MUST be raised and SHOULD
   convey an error type of `PROOF_VERIFICATION_ERROR`.
6. If `domain` was given, and it does not contain the same strings as `proof.domain` (treating a single string as a set
   containing just that string), an error MUST be raised and SHOULD convey an error type of `INVALID_DOMAIN_ERROR`.
7. If `challenge` was given, and it does not match `proof.challenge`, an error MUST be raised and SHOULD convey an error
   type of `INVALID_CHALLENGE_ERROR`.
8. Let `cryptosuiteVerificationResult` be the result of running the `cryptosuite.verifyProof()` algorithm with
   `securedDocument` provided as input.
9. Return a verification result with items:
   - `verified`: `cryptosuiteVerificationResult.verified`.
   - `verifiedDocument`: `cryptosuiteVerificationResult.verifiedDocument`.
   - `mediaType`: `mediaType`.

## Verify Proof Sets and Chains

In a proof set or proof chain, a secured data document has a proof attribute which contains a list of proofs
(`allProofs`). The following algorithm provides a method of checking the authenticity and integrity of a secured data
document, achieved by verifying every proof in `allProofs`. Other approaches are possible, particularly if it is only
desired to verify a subset of the proofs contained in `allProofs`. If another approach is taken to verify only a subset
of the proofs, then it is important to note that any proof in that subset with a `previousProof` can only be considered
verified if the proofs it references are also considered verified.

Required input is a secured data document (`securedDocument`). A list of verification results corresponding to each
proof in `allProofs` is generated, and a single combined verification result is returned as output. Implementations MAY
return any of the other verification results and/or any other metadata alongside the combined verification result.

1. Set `allProofs` to `securedDocument.proof`.
2. Set `verificationResults` to an empty list.
3. For each `proof` in `allProofs`, do the following steps:

   1. Let `matchingProofs` be an empty list.
   2. If `proof` contains a `previousProof` attribute and the value of this attribute is a string, add the element from
      `allProofs` with an `id` attribute value matching the value of `previousProof` to `matchingProofs`. If a proof
      with `id` value equal to the value of `previousProof` does not exist in `allProofs`, an error MUST be raised and
      SHOULD convey an error type of `PROOF_VERIFICATION_ERROR`. If the `previousProof` attribute is a list, add each
      element from `allProofs` with an `id` attribute value that matches the value of an element of that list. If any
      element of `previousProof` list has an `id` attribute value that does not match the `id` attribute value of any
      element of `allProofs`, an error MUST be raised and SHOULD convey an error type of `PROOF_VERIFICATION_ERROR`.
   3. Let `inputDocument` be a copy of `securedDocument` with the proof value removed and then set `inputDocument.proof`
      to `matchingProofs`.

      > NOTE: Secure document and previous proofs
      >
      > See the note in Step 6 of Section [Add Proof Set/Chain](#add-proof-setchain) to learn about what document
      > properties and previous proofs this step secures.

   4. Run steps 4 through 8 of the algorithm in Section [Verify Proof](#verify-proof) on `inputDocument`; if no
      exceptions are raised, append `cryptosuiteVerificationResult` to `verificationResults`.

4. Set `successfulVerificationResults` to an empty list.
5. Let `combinedVerificationResult` be an empty struct. Set `combinedVerificationResult.status` to `true`,
   `combinedVerificationResult.document` to `null`, and `combinedVerificationResult.mediaType` to `null`.
6. For each `cryptosuiteVerificationResult` in `verificationResults`:

   1. If `cryptosuiteVerificationResult.verified` is `false`, set `combinedVerificationResult.verified` to `false`.
   2. Otherwise, set `combinedVerificationResult.document` to `cryptosuiteVerificationResult.document`, set
      `combinedVerificationResult.mediaType` to `cryptosuiteVerificationResult.mediaType`, and append
      `cryptosuiteVerificationResult` to `successfulVerificationResults`.

7. If `combinedVerificationResult.status` is `false`, set `combinedVerificationResult.document` to `null` and
   `combinedVerificationResult.mediaType` to `null`.
8. Return `combinedVerificationResult`, `successfulVerificationResults`.

## Context Validation

The following algorithm provides one mechanism that can be used to ensure that an application understands the contexts
associated with a document before it executed business rules specific to the input in the document. This algorithm takes
inputs of a document (a map `inputDocument`), a set of known JSON-LD Contexts (a list `knownContext`), and a boolean to
recompact when unknown contexts are detected (a boolean `recompact`).

This algorithm returns a context validation result, a struct whose items are:

- `validated`: `true` or `false`.
- `validatedDocument`: `null` if `validated` is `false`; otherwise, an input document.
- `warnings`: a list of problem details, which defaults to an empty list.
- `errors`: a list of problem details, which defaults to an empty list.

The context validation algorithm is as follows:

1. Set `result.validated` to false, `result.warnings` to an empty list, `result.errors` to an empty list,
   `compactionContext` to an empty list; and clone `inputDocument` to `result.validatedDocument`.
2. Let `contextValue` to be the value of the `@context` property of `result.validatedDocument`, which might be
   undefined.
3. If `contextValue` does not deeply equal to `knownContext`, any subtree in `result.validatedDocument` contains an
   `@context` property, or any URI in `contextValue` dereferences to a JSON-LD Context file that does not match a known
   good value or cryptographic hash, then perform the applicable action:

   1. If `recompact` is `true`, set `result.validatedDocument` to the result of running the JSON-LD Compaction Algorithm
      with the `inputDocument` and `knownContext` as inputs. If the compaction fails, add at least one error to
      `result.errors`.
   2. If `recompact` is not `true`, add at least one error to `result.errors`.

4. If `result.errors` is empty, set `result.validated` to `true`; otherwise, set `result.validated` to `false`, and
   remove the `document` property from `result`.
5. Return the value of `result`.

Implementations MAY include additional warnings or errors that enforces further validation rules that are specific to
the implementation or a particular use case.

## Processing Errors

The algorithm described in this specification, as well as in various cryptographic suite specifications, throw specific
types of errors. Implementers might find it useful to convey these errors to other libraries or software systems. This
section provides specific URLs, descriptions, and error codes for the errors, such that an ecosystem implementing
technologies described by this specification might interoperate more effectively when errors occur.

When exposing these errors through an HTTP interface, implementers SHOULD use
[RFC-9457](https://www.rfc-editor.org/rfc/rfc9457) to encode the error data structure as a `ProblemDetails` map. If
[RFC-9457](https://www.rfc-editor.org/rfc/rfc9457) is used:

- The `type` value of the error object MUST be a URL that starts with the value `https://w3id.org/security#` and ends
  with the value in the section listed below.
- The `code` value MUST be the integer code described in the table below (in parentheses, beside the type name).
- The `title` value SHOULD provide a short but specific human-readable string for the error.
- The `detail` value SHOULD provide a longer human-readable string for the error.

The types of potential errors are listed below:

- **PROOF_GENERATION_ERROR (-16)**: A request to generate a proof failed. See Section [Add Proof](#add-proof) and
  Section [Add Proof Set/Chain](#add-proof-setchain).
- **PROOF_VERIFICATION_ERROR (-17)**: An error was encountered during proof verification. See Section
  [Verify Proof](#verify-proof).
- **PROOF_TRANSFORMATION_ERROR (-18)**: An error was encountered during the transformation process.
- **INVALID_DOMAIN_ERROR (-19)**: The `domain` value in a proof did not match the expected value. See Section
  [Verify Proof](#verify-proof).
- **INVALID_CHALLENGE_ERROR (-20)**: The `challenge` value in a proof did not match the expected value. See Section
  [Verify Proof](#verify-proof).
