# Cryptographic Suites

A data integrity proof is designed to be easy to use by developers and therefore strives to minimize the amount of
information one has to remember to generate a proof. Often, just the cryptographic suite name (such as
`eddsa-rdfc-2022`) is required from developers to initiate the creation of a proof. These cryptographic suites are often
created and reviewed by people that have the requisite cryptographic training to ensure that safe combinations of
cryptographic primitives are used. This section specifies the requirements for authoring cryptographic suite
specifications.

The requirements for all data integrity cryptographic suite specifications are as follows:

- The specification MUST be published as a human-readable document at a URL.
- The specification MUST identify a cryptographic suite `type` and any parameters that can be used with the suite.
- The specification MUST detail the transformation algorithms (if any), parameters, and other necessary details, used to
  modify input data into the data to be protected.
- The specification MUST detail the hashing algorithms parameters, and other necessary details used to perform
  cryptographic hashing to the data to be protected.
- The specification MUST detail the proof serialization algorithms, parameters, and other necessary details used to
  perform cryptographic protection of the data.
- The specification MUST detail the proof verification algorithms, parameters, and other necessary details used to
  perform cryptographic verification of the data.
- The specification MUST define a **data integrity cryptographic suite instantiation algorithm** that accepts a set of
  options (a map `options`) and returns a cryptosuite instance (a struct `cryptosuite`). This algorithm SHOULD be listed
  in the [Verifiable Credential Extensions](https://w3c.github.io/vc-extensions/) document. A **data integrity
  cryptographic suite instance** struct has the following items.

  - `createProof`: An algorithm that takes an input document (a map `inputDocument`) and proof options (a map `options`)
    as input, and produces a data integrity proof (a map) or an error.
  - `verifyProof`: An algorithm that takes a secured data document (a map `securedDocument`) as input, and produces a
    cryptosuite verification result or an error. The cryptosuite verification result is a struct that contains the
    following items:

    - `verified`: A boolean that is `true` if the verification succeeded, or `false` otherwise.
    - `verifiedDocument`: A map that represents the secured data document with the verified proofs removed if `verified`
      is `true`, or `null` otherwise.

    The structure MAY contain other implementation-specific information that is useful for developers, such as debugging
    information. If an error is produced, the verification process failed to complete. An error, such as a network
    error, does not mean that a future attempt at verification would fail.

- The specification MUST detail any known resource starvation attack that can occur in an algorithm and provide testable
  mitigations against each attack.
- The specification MUST contain a Security Considerations section detailing security considerations specific to the
  cryptographic suite.
- The specification MUST contain a Privacy Considerations section detailing privacy considerations specific to the
  cryptographic suite.
- The JSON-LD context associated with the cryptographic suite MUST have its terms protected from unsafe redefinition, by
  use of the `@protected` keyword.

A cryptosuite instance is instantiated using a cryptosuite instantiation algorithm and is made available to algorithms
in an implementation-specific manner. Implementations MAY use the
[Verifiable Credential Extensions](https://w3c.github.io/vc-extensions/) document to discover known cryptosuite
instantiation algorithms.

## Data Integrity Proof

A number of cryptographic suites follow the same basic pattern when expressing a data integrity proof. This section
specifies that a general design pattern, a cryptographic suite type called a `DataIntegrityProof`, which reduces the
burden of writing and implementing cryptographic suites through the reuse of design primitives and source code.

When specifying a cryptographic suite that utilizes this design pattern, the `proof` value takes the following form:

- `type`: The `type` property MUST contain the string `DataIntegrityProof`.
- `cryptosuite`: The value of the `cryptosuite` property MUST be a string that identifies the cryptographic suite. If
  the processing environment supports string subtypes, the subtype of the `cryptosuite` value MUST be the
  `https://w3id.org/security#cryptosuiteString` subtype.
- `proofValue`: The `proofValue` property MUST be used.

Cryptographic suite designers MUST use mandatory `proof` value properties, and MAY define other properties specific to
their cryptographic suite.
