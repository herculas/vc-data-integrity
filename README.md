# ld-crypto-syntax

[![Push-Release](https://github.com/herculas/ld-crypto-syntax/actions/workflows/push-release.yml/badge.svg)](https://github.com/herculas/ld-crypto-syntax/actions/workflows/push-release.yml)

The syntax of JSON-LD cryptographic suites and associated entities. The interface is compatible with the W3C
specification of [JSON-LD](https://www.w3.org/TR/json-ld11/) and
[Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/).

## Introduction

Linked data signatures can be used to provide integrity and authenticity guarantees for linked data files. This package
is designed to provide a fundamental and general interface for signature implementation and application.

## Getting started

To use this package within your own Deno project, run:

```shell
deno add jsr:@crumble-jon/ld-crypto-syntax
```

## Usage

You should use this package along with specific signature implementations or cryptographic suites, e.g.,
[Ed25519 Signature](https://jsr.io/@crumble-jon/ld-sig-ed25519).

The usages with individual cryptographic suites always contains the following elements:

- Generate keypairs or import from external files.
- Pair keypairs with a corresponding cryptographic suite.
- Perform the sign and verify operations.
