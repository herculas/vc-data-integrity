import type { Keypair } from "../key/keypair.ts"
import type { Purpose } from "../purpose/base.ts"
import type { Type } from "../syntax.ts"
import { toW3CTimestampString } from "../util.ts"
import type { Proof } from "./proof.ts"
import type { Suite } from "./suite.ts"

/**
 * Base class from which various linked data signature suites inherit.
 * This class should not be used directly, but should be extended by sub-classes.
 */
export abstract class Signature implements Suite {
  type: Type
  keypair: Keypair
  context: string
  proof?: object
  time?: Date
  useNativeCanonize?: boolean
  canonizeOptions?: object

  constructor(
    type: Type,
    keypair: Keypair,
    context: string,
    proof?: Proof,
    time?: Date,
    useNativeCanonize?: boolean,
    canonizeOptions?: object,
  ) {
    this.type = type
    this.keypair = keypair
    this.context = context
    this.proof = proof
    this.time = time
    this.useNativeCanonize = useNativeCanonize
    this.canonizeOptions = canonizeOptions
  }

  prove(
    document: object,
    purpose: Purpose,
    set: Array<Proof>,
  ): Promise<Proof> {
    let proof: Proof
    if (this.proof) {
      proof = Object.assign({ type: this.type, proofPurpose: purpose.term, proofValue: "" }, this.proof)
    } else {
      proof = {
        type: this.type,
        proofPurpose: purpose.term,
        proofValue: "",
      }
    }

    // set the proof type
    proof.type = this.type

    // set the proof creation date-time
    if (!proof.created) {
      const date = this.time || new Date()
      const dateStr = toW3CTimestampString(date)
      proof.created = dateStr
    }

    return Promise.resolve(proof)
  }

  derive(
    document: object,
    purpose: Purpose,
    set: Array<Proof>,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }

  verify(
    document: object,
    proof: object,
    purpose: Purpose,
    set: Array<Proof>,
  ): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
}
