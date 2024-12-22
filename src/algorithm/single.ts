import type { Suite } from "../mod.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type * as Options from "../types/interface/options.ts"
import { extend } from "../loader/extend.ts"
import { defaultLoader } from "../loader/default.ts"
import { severalToMany } from "../utils/format.ts"

/**
 * Add a digital proof to an input document, which can then be used to verify the document's authenticity and integrity.
 *
 * @param {PlainDocument} document A JSON-LD document to be signed.
 * @param {Suite} suite A cryptographic suite that is capable of signing and verifying documents.
 * @param {Options.AddProof} options Additional options that can be used to configure the proof.
 *
 * @returns {Promise<PlainDocument>} Resolve to the secured document with the added proof.
 */
export async function add(document: PlainDocument, suite: Suite, options: Options.AddProof): Promise<PlainDocument> {
  // prepare the document loader
  if (options.loader) {
    options.loader = extend(options.loader)
  } else {
    options.loader = defaultLoader
  }

  const securedDocument: PlainDocument = { ...document }
  delete securedDocument.proof

  // construct the cryptographic proof
  const proof = await suite.createProof(securedDocument, options.purpose, [], options.loader)

  // check the existence of type, verificationMethod, and proof purpose
  if (!proof.verificationMethod) {
    throw new Error("Proof must have a `verificationMethod`.")
  }

  // check the correspondence of domain
  if (options.domain) {
    if (!proof.domain) {
      throw new Error("Proof must have a `domain`.")
    }
    const domain = severalToMany(proof.domain)
    if (!domain.includes(options.domain)) {
      throw new Error("Proof domain does not match the expected domain.")
    }
  }

  // check the correspondence of challenge
  if (options.challenge) {
    if (!proof.challenge) {
      throw new Error("Proof must have a `challenge`.")
    }
    if (options.challenge !== proof.challenge) {
      throw new Error("Proof challenge does not match the expected challenge.")
    }
  }

  // construct and output the secured document
  securedDocument.proof = proof
  return securedDocument
}

export async function verify(
  documentBytes: Uint8Array,
  suite: Suite,
  expectedProofPurpose?: string,
  domain?: Array<string>,
  challenge?: string,
) {}
