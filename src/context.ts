import * as credentialVer1 from "../data/context/credential-v1.json" with { type: "json" }
import * as credentialVer2 from "../data/context/credential-v2.json" with { type: "json" }
import * as securityVer1 from "../data/context/security-v1.json" with { type: "json" }
import * as securityVer2 from "../data/context/security-v2.json" with { type: "json" }

const CREDENTIAL_CONTEXT_V1_URL = "https://www.w3.org/2018/credentials/v1"
const CREDENTIAL_CONTEXT_V2_URL = "https://www.w3.org/ns/credentials/v2"
const SECURITY_CONTEXT_V1_URL = "https://w3id.org/security/v1"
export const SECURITY_CONTEXT_V2_URL = "https://w3id.org/security/v2"

// const SECURITY_PROOF_URL = "https://w3id.org/security#proof"
// const SECURITY_SIGNATURE_URL = "https://w3id.org/security#signature"

export enum CredentialVersion {
  V1 = 1,
  V2 = 2,
}

export const urlVersionMap = new Map<string, CredentialVersion>([
  [CREDENTIAL_CONTEXT_V1_URL, CredentialVersion.V1],
  [CREDENTIAL_CONTEXT_V2_URL, CredentialVersion.V2],
])

export const versionContextMap = new Map<CredentialVersion, object>([
  [CredentialVersion.V1, credentialVer1.default],
  [CredentialVersion.V2, credentialVer2.default],
])

export const urlContextMap = new Map<string, object>([
  [CREDENTIAL_CONTEXT_V1_URL, credentialVer1.default],
  [CREDENTIAL_CONTEXT_V2_URL, credentialVer2.default],
  [SECURITY_CONTEXT_V1_URL, securityVer1.default],
  [SECURITY_CONTEXT_V2_URL, securityVer2.default],
])
