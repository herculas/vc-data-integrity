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

   > 👍 NOTE: This step protects the document and existing proofs
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

## Verify Proof Sets and Chains

## Context Validation
