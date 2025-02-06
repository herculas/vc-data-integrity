import * as CREDENTIAL_V1 from "../../assets/credential-v1.json" with { type: "json" }
import * as CREDENTIAL_V2 from "../../assets/credential-v2.json" with { type: "json" }
import * as CREDENTIAL_EXAMPLES_V2 from "../../assets/credential-example-v2.json" with { type: "json" }

import * as SECURITY_V1 from "../../assets/security-v1.json" with { type: "json" }
import * as SECURITY_V2 from "../../assets/security-v2.json" with { type: "json" }

import * as CID_V1 from "../../assets/cid-v1.json" with { type: "json" }
import * as DID_V1 from "../../assets/did-v1.json" with { type: "json" }

import * as DATA_INTEGRITY_V2 from "../../assets/data-integrity-v2.json" with { type: "json" }

import * as CONTEXT_URL from "./url.ts"

/**
 * The map of context URLs to the context contents.
 */
export const URL_CONTEXT_MAP: Map<string, object> = new Map<string, object>([
  [CONTEXT_URL.CREDENTIAL_V1, CREDENTIAL_V1.default],
  [CONTEXT_URL.CREDENTIAL_V2, CREDENTIAL_V2.default],
  [CONTEXT_URL.CREDENTIAL_EXAMPLE_V2, CREDENTIAL_EXAMPLES_V2.default],
  [CONTEXT_URL.SECURITY_V1, SECURITY_V1.default],
  [CONTEXT_URL.SECURITY_V2, SECURITY_V2.default],
  [CONTEXT_URL.CID_V1, CID_V1.default],
  [CONTEXT_URL.DID_V1, DID_V1.default],
  [CONTEXT_URL.DATA_INTEGRITY_V2, DATA_INTEGRITY_V2.default],
])
