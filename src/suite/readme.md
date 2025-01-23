# Cryptographic Suites

A data integrity proof is designed to be easy to use by developers and therefore strives to minimize the amount of
information one has to remember to generate a proof. Often, just the cryptographic suite name (such as
`eddsa-rdfc-2022`) is required from developers to initiate the creation of a proof. These cryptographic suites are often
created and reviewed by people that have the requisite cryptographic training to ensure that safe combinations of
cryptographic primitives are used.

The requirement for all data integrity cryptographic suite specifications are as follows:

- The specification MUST be published as a human-readable document at a URL.
- The specification MUST identify a cryptographic suite `type` and any parameters that can be used with the suite.
- The specification MUST detail the _transformation algorithms_ (if any), parameters, and other necessary details, used
  to modify input data into the data to be protected.
- The specification MUST detail the _hashing algorithms_ parameters, and other necessary details used to perform
  cryptographic hashing to the data to be protected.
- The specification MUST detail the _proof serialization algorithms_, parameters, and other necessary details used to
  perform cryptographic protection of the data.
- The specification MUST detail the _proof verification algorithms_, parameters, and other necessary details used to
  perform cryptographic verification of the data.
- The specification MUST define a _data integrity cryptographic suite instantiation algorithm_ that accepts a set of
  options and returns a cryptosuite instance. This algorithm SHOULD be listed in the _Verifiable Credential Extensions_
  document. A data integrity cryptographic suite instance struct hat the following items:

  - `createProof`: An algorithm that takes an input document and proof options as input, and produces a data integrity
    proof or an error.
  - `verifyProof`: An algorithm that takes a secured data document as input, and produces a cryptosuite verification
    result or an error. The cryptosuite verification result is a struct that contains the following items:

    - `verified`: A boolean that is `true` if the verification succeeded, or `false` otherwise.
    - `verifiedDocument`: A map that represents the secured data document with the verified proofs removed if verified
      is `true`, or `null` otherwise.

    The structure MAY contain other implementation-specific information that is useful for developers, such as debugging
    information. If an error is produced, the verification process failed to complete. An error, such as a network
    error, does not mean that a future attempt at verification would fail.

- The specification MUST detail any known resource starvation attack that can occur in an algorithm and provide testable
  mitigations against such attack.
- The specification MUST contain a Security Considerations section detailing security considerations specific to the
  cryptographic suite.
- The specification MUST contain a Privacy Considerations section detailing privacy considerations specific to the
  cryptographic suite.
- The JSON-LD context associated with the cryptographic suite MUST have its terms protected from unsafe redefinition, by
  use of the `@protected` keyword.
