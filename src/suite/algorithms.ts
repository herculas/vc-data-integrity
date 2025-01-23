import { LDErrorCode } from "../error/constants.ts"
import { LDError } from "../error/error.ts"
import type { OneOrMany } from "../mod.ts"
import type { Proof } from "../types/did/proof.ts"
import type { AddManyOptions, AddOneOptions, VerificationResult, VerifyOptions } from "../types/interface/suite.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Cryptosuite } from "./suite.ts"

/**
 * Add a digital proof to an input document, which can then be used to verify the output document's authenticity and
 * integrity.
 *
 * @param {PlainDocument} inputDocument The input document.
 * @param {Cryptosuite} cryptosuite The suite to use for creating the proof.
 * @param {AddOneOptions} options The options to use for creating the proof.
 *
 * @returns {Promise<PlainDocument>} Resolve to a secured data document with a digital proof.
 */
export async function addProof(
  inputDocument: PlainDocument,
  cryptosuite: Cryptosuite,
  options: AddOneOptions,
): Promise<PlainDocument> {
  // Procedures:
  //
  // 1. Let `proof` be the result of calling `cryptosuite.createProof(inputDocument, options)`. If the algorithm
  //    produces an error, the error MUST be propagated and SHOULD convey the error type.
  // 2. If one or more of the `proof.type`, `proof.verificationMethod`, and `proof.proofPurpose` values is not set,
  //    an error MUST be raised and SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
  // 3. If `options` has a non-null `domain` item, it MUST be equal to `proof.domain`, or an error MUST be raised and
  //    SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
  // 4. If `options` has a non-null `challenge` item, it MUST be equal to `proof.challenge`, or an error MUST be raised
  //    and SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
  // 5. Let `securedDataDocument` be a copy of `inputDocument`.
  // 6. Set `securedDataDocument.proof` to the value `proof`.
  // 7. Return `securedDataDocument`.

  const proof = await cryptosuite.createProof(inputDocument, options)

  if (!proof.type || !proof.verificationMethod || !proof.proofPurpose) {
    throw new LDError(
      LDErrorCode.PROOF_GENERATION_ERROR,
      "algorithm.addProof",
      "The type, verificationMethod, and proofPurpose values must be set.",
    )
  }

  if (options.domain && options.domain !== proof.domain) {
    throw new LDError(
      LDErrorCode.PROOF_GENERATION_ERROR,
      "algorithm.addProof",
      "The domain value must be equal to proof.domain.",
    )
  }

  if (options.challenge && options.challenge !== proof.challenge) {
    throw new LDError(
      LDErrorCode.PROOF_GENERATION_ERROR,
      "algorithm.addProof",
      "The challenge value must be equal to proof.challenge.",
    )
  }

  const securedDataDocument = { ...inputDocument }
  securedDataDocument.proof = proof
  return securedDataDocument
}

/**
 * Incrementally add a proof to a proof set or proof chain starting with a secured data document containing either a
 * proof or proof set/chain.
 *
 * @param {PlainDocument} securedDocument A secured data document.
 * @param {Cryptosuite} cryptosuite The suite to use for creating the proof.
 * @param {AddManyOptions} options The options to use for creating the proof.
 *
 * @returns {Promise<PlainDocument>} Resolve to a secured data document with digital proofs.
 */
export async function addProofs(
  securedDocument: PlainDocument,
  cryptosuite: Cryptosuite,
  options: AddManyOptions,
): Promise<PlainDocument> {
  // Procedures:
  //
  // 1. Let `proof` be set to `securedDocument.proof`. Let `allProofs` be an empty list. If `proof` is a list, copy all
  //    the elements of `proof` to `allProofs`. If `proof` is an object, add a copy of that object to `allProofs`.
  // 2. Let the `inputDocument` be a copy of `securedDocument` with the `proof` attribute removed. Let `output` be a
  //    copy of the `inputDocument`.
  // 3. Let `matchingProofs` be an empty list.
  // 4. If `options` has a `previousProof` item that is a string, add the element from `allProofs` with an `id`
  //    attribute matching the `previousProof` to `matchingProofs`. If a proof with `id` equal to `previousProof` does
  //    not exist in `allProofs`, an error MUST be raised and SHOULD convey an error type of `PROOF_GENERATION_ERROR`.
  // 5. If `options` has a `previousProof` item that is an array, add each element from `allProofs` with an `id`
  //    attribute that matches an element of that array. If any element of `previousProof` list has an `id` attribute
  //    that does not matches the `id` attribute of any element of `allProofs`, an error MUST be raised and SHOULD
  //    convey an error type of `PROOF_GENERATION_ERROR`.
  // 6. Set `inputDocument.proof` to `matchingProofs`.
  // 7. Run steps 1 through 6 of the algorithm of Add Proof, passing `inputDocument`, `cryptosuite`, and `options`. If
  //    no exceptions are raised, append the generated proof value to the `allProofs`; otherwise, raise the exception.
  // 8. Set `output.proof` to the value of `allProofs`.
  // 9. Return `output` as the new secured data document.

  const proof = securedDocument.proof as OneOrMany<Proof>
  const allProofs = Array.isArray(proof) ? proof : [proof]

  const inputDocument = { ...securedDocument }
  delete inputDocument.proof
  const output = { ...inputDocument }

  const matchingProofs: Array<Proof> = []

  if (options.previousProof) {
    const previousProofs = Array.isArray(options.previousProof) ? options.previousProof : [options.previousProof]

    for (const previousProof of previousProofs) {
      const matchingProof = allProofs.find((p) => p.id === previousProof)
      if (!matchingProof) {
        throw new LDError(
          LDErrorCode.PROOF_GENERATION_ERROR,
          "algorithm.addProofs",
          `A proof with the given id ${previousProof} does not exist.`,
        )
      }
      matchingProofs.push(matchingProof)
    }
  }

  inputDocument.proof = matchingProofs
  const newProof = await addProof(inputDocument, cryptosuite, options)
  allProofs.push(newProof.proof as Proof)

  output.proof = allProofs
  return output
}

/**
 * Check the authenticity and integrity of a secured data document by verifying the proofs contained within it.
 * 
 * @param {PlainDocument} securedDocument The secured data document.
 * @param {Cryptosuite} cryptosuite The suite to use for verifying the proof.
 * @param {VerifyOptions} options The options to use for verifying the proof.
 * 
 * @returns {Promise<VerificationResult>} Resolve to a verification result.
 */
export async function verifyProof(
  securedDocument: PlainDocument,
  cryptosuite: Cryptosuite,
  options: VerifyOptions,
): Promise<VerificationResult> {
  // Procedures:
  //
  // 1. Let `proof` be set to `securedDocument.proof`.
  // 2. If one or more of the `proof.type`, `proof.verificationMethod`, and `proof.proofPurpose` values does not exist,
  //    an error MUST be raised and SHOULD convey an error type of `PROOF_VERIFICATION_ERROR`.
  // 3. If `options` has a non-null `expectedProofPurpose` item, it MUST be equal to `proof.proofPurpose`, or an error
  //    MUST be raised and SHOULD convey an error type of `PROOF_VERIFICATION_ERROR`.
  // 4. If `options` has a non-null `domain` item, it MUST be equal to `proof.domain`, or an error MUST be raised and
  //    SHOULD convey an error type of `INVALID_DOMAIN_ERROR`.
  // 5. If `options` has a non-null `challenge` item, it MUST be equal to `proof.challenge`, or an error MUST be raised
  //    and SHOULD convey an error type of `INVALID_CHALLENGE_ERROR`.
  // 6. Let `cryptosuiteVerificationResult` be the result of running the `cryptosuite.verifyProof(securedDocument,
}