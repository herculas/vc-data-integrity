import type { LDErrorCode } from "./constants.ts"

export class LDError extends Error {
  code: LDErrorCode

  constructor(code: LDErrorCode, name: string, message: string) {
    super(message)
    this.code = code
    this.name = name
    this.message = message
  }
}
