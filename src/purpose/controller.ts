import { DID_CONTEXT_V1_URL } from "../context/constants.ts"
import { expandController } from "../utils/jsonld.ts"
import { DID_VR_TERMS } from "./constants.ts"
import { Purpose } from "./purpose.ts"
import type { Proof, Suite } from "../mod.ts"
import type { Controller, VerificationMethod } from "../types/interface/common.ts"
import type { ValidationResult } from "../types/interface/purpose.ts"
import type { JsonLdDocument } from "../types/jsonld/document.ts"
import type { Loader } from "../types/loader.ts"

export class ControllerPurpose extends Purpose {
  controller?: Controller

  private defined: boolean

  /**
   * @param {object} controller The description of the controller, if it is not to be dereferenced via a document
   * loader.
   */
  constructor(term: string, controller?: Controller, date?: Date, delta?: number) {
    super(term, date, delta)
    this.controller = controller
    this.defined = DID_VR_TERMS.has(term)
  }

  /**
   * Validate the purpose of a proof.
   *
   * This method is called during proof verification, after the proof value has been checked against the given
   * verification method, e.g., in the case of a digital signature, the signature has been cryptographically
   * verified agianst the public key.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {JsonLdDocument} document The document that the proof is to be verified against.
   * @param {Suite} suite The cryptographic suite that the proof is to be verified against.
   * @param {VerificationMethod} method The verification method that the proof is to be verified against.
   *
   * @returns {Promise<ValidationResult>} Resolve to an object with `valid` and `error` properties.
   */
  override async validate(
    proof: Proof,
    document: JsonLdDocument,
    suite: Suite,
    method: VerificationMethod,
    loader: Loader,
  ): Promise<ValidationResult> {
    try {

      // delegate to super class
      const result = await super.validate(proof, document, suite, method, loader)
      if (result.error) throw result.error

      // get the verification method
      const verificationId = method.id!

      // construct the controller
      let controller: Controller
      if (this.controller) {
        controller = this.controller
      } else {
        let controllerId: string
        if (typeof method.controller === "object" && method.controller.id) {
          controllerId = method.controller.id
        } else if (typeof method.controller === "string") {
          controllerId = method.controller
        } else {
          throw new Error("Invalid verification method controller!")
        }
        // apply optimization to controller documents that are DID documents
        const loaded = await loader(controllerId)
        let rawController = loaded.document!

        const mustFrame = !(this.defined && document["@context"] === DID_CONTEXT_V1_URL ||
          (Array.isArray(document["@context"]) && document["@context"][0] === DID_CONTEXT_V1_URL))
        if (mustFrame) {
          document = await expandController(document, controllerId, this.term, method.id!, loader)
        }
        result.controller = document
      }

      const terms = result.controller.term || []
      const methods = Array.isArray(terms) ? terms : [terms]
      result.valid = methods.some(m => {
        return m === method.id
      })


     catch (error) {
      const e = error instanceof Error ? error : new Error("Purpose validation failed")
      return {
        valid: false,
        error: e.message,
      }
    }
  }
}
