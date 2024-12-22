import type { LoadedDocument } from "../types/interface/loader.ts"

// deno-lint-ignore require-await
export async function defaultLoader(_url: string): Promise<LoadedDocument> {
  throw new Error("Method not implemented.")
}
