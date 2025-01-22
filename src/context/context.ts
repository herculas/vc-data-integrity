import * as CREDENTIAL_V1 from "../../data/contexts/credential-v1.json" with { type: "json" }
import * as CREDENTIAL_V2 from "../../data/contexts/credential-v2.json" with { type: "json" }
import * as CREDENTIAL_EXAMPLES_V2 from "../../data/contexts/credential-example-v2.json" with { type: "json" }

import * as SECURITY_V1 from "../../data/contexts/security-v1.json" with { type: "json" }
import * as SECURITY_V2 from "../../data/contexts/security-v2.json" with { type: "json" }

import * as CID_V1 from "../../data/contexts/cid-v1.json" with { type: "json" }
import * as DID_V1 from "../../data/contexts/did-v1.json" with { type: "json" }

import * as CONTEXT_URL from "./constants.ts"

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
])
