import * as credentialVer1 from "../../data/context/credential-v1.json" with { type: "json" }
import * as credentialVer2 from "../../data/context/credential-v2.json" with { type: "json" }
import * as securityVer1 from "../../data/context/security-v1.json" with { type: "json" }
import * as securityVer2 from "../../data/context/security-v2.json" with { type: "json" }

import * as CONSTANTS from "./constants.ts"

export enum CredentialVersion {
  V1 = 1,
  V2 = 2,
}

export const urlVersionMap = new Map<string, CredentialVersion>([
  [CONSTANTS.CREDENTIAL_CONTEXT_V1_URL, CredentialVersion.V1],
  [CONSTANTS.CREDENTIAL_CONTEXT_V2_URL, CredentialVersion.V2],
])

export const versionContextMap = new Map<CredentialVersion, object>([
  [CredentialVersion.V1, credentialVer1.default],
  [CredentialVersion.V2, credentialVer2.default],
])

export const urlContextMap = new Map<string, object>([
  [CONSTANTS.CREDENTIAL_CONTEXT_V1_URL, credentialVer1.default],
  [CONSTANTS.CREDENTIAL_CONTEXT_V2_URL, credentialVer2.default],
  [CONSTANTS.SECURITY_CONTEXT_V1_URL, securityVer1.default],
  [CONSTANTS.SECURITY_CONTEXT_V2_URL, securityVer2.default],
])
