import { sha256 } from "../src/utils/crypto.ts"

Deno.test("SHA256 hash", async () => {
  const str = crypto.getRandomValues(new Uint8Array(32)).toString()
  const hash = await sha256(str)
  console.log(hash)
})
