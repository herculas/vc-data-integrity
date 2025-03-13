# Verifiable Credential Data Integrity

[![Release](https://github.com/herculas/vc-data-integrity/actions/workflows/release.yml/badge.svg)](https://github.com/herculas/vc-data-integrity/actions/workflows/release.yml)
[![JSR](https://jsr.io/badges/@herculas/vc-data-integrity)](https://jsr.io/@herculas/vc-data-integrity)
[![JSR Score](https://jsr.io/badges/@herculas/vc-data-integrity/score)](https://jsr.io/@herculas/vc-data-integrity)

The syntax of verifiable credential data integrity proofs and associated entities. The interface is compatible with the
W3C specification of [JSON-LD](https://www.w3.org/TR/json-ld11/),
[Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/) and
[Verifiable Credential Data Integrity](https://www.w3.org/TR/vc-data-integrity/).

## Introduction

Data integrity proofs can be used to provide integrity and authenticity guarantees for linked data files. This package
is designed to provide a fundamental and general interface for proof implementation and application.

## How it Works?

The operation of Data Integrity is conceptually simple.

### Proving

To create a cryptographic proof, the following steps are performed: 1) Transformation, 2) Hashing, and 3) Proof
Generation.

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
[EdDSA cryptosuites](https://jsr.io/@herculas/vc-suite-eddsa).

The usages with individual cryptographic suites always contains the following elements:

- Generate keypairs or import from external files.
- Pair keypairs with a corresponding cryptographic suite.
- Perform the sign and verify operations.
