import type { ErrorCode } from "./constants.ts"

export class DataIntegrityError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, name: string, message: string) {
    super(message)
    this.code = code
    this.name = name
    this.message = message
  }
}
