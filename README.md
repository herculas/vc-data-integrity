# Verifiable Credential Data Integrity

[![Release](https://github.com/herculas/vc-data-integrity/actions/workflows/release.yml/badge.svg)](https://github.com/herculas/vc-data-integrity/actions/workflows/release.yml)

The syntax of verifiable credential data integrity proofs and associated entities. The interface is compatible with the
W3C specification of [JSON-LD](https://www.w3.org/TR/json-ld11/),
[Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/) and
[Verifiable Credential Data Integrity](https://www.w3.org/TR/vc-data-integrity/).

## Introduction

Data integrity proofs can be used to provide integrity and authenticity guarantees for linked data files. This package
is designed to provide a fundamental and general interface for proof implementation and application.

## Implementations

A data integrity proof is designed to be easy to use by developers and therefore strives to minimize the amount of
information one has to remember to generate a proof. Often, just the cryptographic suite name (such as
`eddsa-rdfc-2022`) is required from developers to initiate the creation of a proof. These cryptographic suites are often
created and reviewed by people that have the requisite cryptographic training to ensure that safe combinations of
cryptographic primitives are used.

The requirement for all data integrity cryptographic suite implementations are as follows:

- The implementation MUST identify a cryptographic suite `type` and any parameters that can be used with the suite.
- The implementation MUST detail the **_transformation algorithms_** (if any), parameters, and other necessary details,
  used to modify input data into the data to be protected.
- The implementation MUST detail the **_hashing algorithms_** parameters, and other necessary details used to perform
  cryptographic hashing to the data to be protected.
- The implementation MUST detail the **_proof serialization algorithms_**, parameters, and other necessary details used
  to perform cryptographic protection of the data.
- The implementation MUST detail the **_proof verification algorithms_**, parameters, and other necessary details used
  to perform cryptographic verification of the data.
- The implementation MUST define a **_data integrity cryptographic suite instantiation algorithm_** that accepts a set
  of options and returns a cryptosuite instance. This algorithm SHOULD be listed in the
  [Verifiable Credential Extensions](https://w3c.github.io/vc-extensions/) document. A data integrity cryptographic
  suite instance struct hat the following items:

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

## How it Works?

The operation of Data Integrity is conceptually simple.

### Proving

To create a cryptographic proof, the following steps are performed: 1) Transformation, 2) Hashing, and 3) Proof
Generation.

![To create a cryptographic proof, data is transformed, hashed, and cryptographically protected.](https://www.w3.org/TR/vc-data-integrity/diagrams/hiw-creation.svg)

**_Transformation_** is a process described by a **_transformation algorithm_** that takes input data and prepares it
for the hashing process. One example of a possible transformation is to take a record of people's names that attended a
meeting, sort the list alphabetically by the individual's family name, and rewrite the names on a piece of paper, one
per line, in sorted order. Examples of transformations include
[canonicalization](https://en.wikipedia.org/wiki/Canonicalization) and
[binary-to-text](https://en.wikipedia.org/wiki/Binary-to-text_encoding) encoding.

**_Hashing_** is a process described by a **_hashing algorithm_** that calculates an identifier for the transformed data
using a cryptographic hash function. This process is conceptually similar to how a phone address book functions, where
one takes a person's name (the input data) and maps that name to that individual's phone number (the hash). Examples of
cryptographic hash functions include SHA-3 and BLAKE-3.

**_Proof Generation_** is a process described by a **_proof serialization algorithm_** that calculates a value that
protects the integrity of the input data from modification or otherwise proves a certain desired threshold of trust.
This process is conceptually similar to the way a wax seal can be used on an envelope containing a letter to establish
trust in the sender and show that the letter has not been tampered with in transit. Examples of proof serialization
functions include **digital signatures**, **proofs of stake**, and **proofs of knowledge**, in general.

### Verifying

To verify a cryptographic proof, the following steps are performed: 1) Transformation, 2) Hashing, and 3) Proof
Verification.

![To verify a cryptographic proof, data is transformed, hashed, and checked for correctness.](https://www.w3.org/TR/vc-data-integrity/diagrams/hiw-verification.svg)

During verification, the **_transformation_** and **_hashing_** steps are conceptually the same as described above.

**_Proof Verification_** is a process that is described by a **_proof verification algorithm_** that applies a
cryptographic proof verification function to see if the input data can be trusted. Possible proof verification functions
include **digital signatures**, **proofs of stake**, and **proofs of knowledge**, in general.

## Getting started

To use this package within your own Deno project, run:

```shell
deno add jsr:@herculas/vc-data-integrity
```

## Usage

You should use this package along with specific signature implementations or cryptographic suites, e.g.,
[Ed25519 Signature](https://jsr.io/@crumble-jon/ld-sig-ed25519).

The usages with individual cryptographic suites always contains the following elements:

- Generate keypairs or import from external files.
- Pair keypairs with a corresponding cryptographic suite.
- Perform the sign and verify operations.
