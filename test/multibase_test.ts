import { assertEquals } from "@std/assert"
import { bytesToHex, hexToBytes } from "../src/utils/format.ts"
import { base58btc, base64url, base64urlnopad } from "../src/utils/multibase.ts"

Deno.test("base-58-btc encoding and decoding 1", () => {
  const source = "1cb4290918ffb04a55ff7ae1e55e316a9990fda8eec67325eac7fcbf2ddf9dd2" +
    "b06716a657e72b284c9604df3a172ecbf06a1a475b49ac807b1d9162df855636"
  const expectedEncoded = "zaHXrr7AQdydBk3ahpCDpWbxfLokDqmCToYm2dyWvpcF" +
    "VyWooC2he63w1f7UNQoAMKdhaRtcnaE2KTo5o5vTCcfw"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-58-btc encoding and decoding 2", () => {
  const source = "c6798ff29f725dfd39aa4daf60fbb423cf9baf4e157f6b49f112c201015c6e73" +
    "0dc877154e65cf467f8ee2b61ec86d98ed78334b1cc9f3dba2e1745f37205e92"
  const expectedEncoded = "z4y9rJ7JxwfZZUBAHgDHJh7FzMbsycPhEtcSHqrfyn7f" +
    "x3S5MWdajNu1r6SsJmirzfcWHe7vp9XKHmRqW6qe7u3d3"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-58-btc encoding and decoding 3", () => {
  const source = "f15c3b599eb9b3cad05df9d8e8b39a70a86375833b53743c764ac0a88c4457d6" +
    "0707fd7d073e03d906130631d87803f80a9824dc9939632ba92d418181be9d16"
  const expectedEncoded = "z5ptCet75SaEgzG4v4zJhbJtfNi74Wv7Fq15hhKouJQQ" +
    "jEPQvPZKaYxcMXAMLPQS2FXrkCWokNJkFVkwxNzZfD5oT"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-58-btc encoding and decoding 4", () => {
  const source = "177ac088806c2506d49f0bfec16056a6a80ace62cd029888ad561aba22a59d19" +
    "2d77d9b1fc28df80dea5ee6c8bceb16f1b8bff6bd6ff2d8f8778bdde48bafa7b" +
    "6cc1f914c0168b5c04499882f632deea9cb7d977e888bb0e1ee9fb20ff03b025"
  const expectedEncoded = "z967Mvv5bxtmLNqTzPZ8KmJjFmFXaAKeQNzq7GWnQkMc" +
    "LtaGSSmuozE5WtJ8PipMe178B1tE28K1vsJur9bGVJhz" +
    "6jgSJsRHFSQeqgH8hhjcg8gZDFJC1b9FsR5ggNmDBqHv"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-58-btc encoding and decoding 5", () => {
  const source = "a5999d1154a3fb5db8805fa762c8c41c1b7f40a231a5d42460d3624534977183" +
    "5f43fe0005295d2061be1789589c1f6385312f0e2e36709c310c77e8289587b7" +
    "9b29ecf7aad14ef61a1393cc2e1f93a7a354bd76bab47d558df060c6ae218975"
  const expectedEncoded = "zz3ca1oME3iYPHM8SgApWFUFVQjiaL9moPqCZ1NAENj3" +
    "biEQ34qc1ex5VJNLD4jh4N4MY2cmDyDCYGv7EyD87yCG" +
    "Ywag8wRwiJE1xiHKLhTEhDQFNfuNMsgLiZnqpkCDJPye"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-58-btc encoding and decoding 6", () => {
  const source = "8b7462ce62db0c8ff19878c4b3561c49eb71b4a743086b6d5b0eda70ecf0afc5" +
    "a03fd88eb207d66b262ed87fd200a4e8e62716e0b329c032b67726b4b0fc737a" +
    "44c1cefdba2fdccb3ece74cc5845aaa93374455a726f6ee4f5f30da9427f608a"
  const expectedEncoded = "zq3EuTeLiGurmB2JR5oL8oWEsT7u2tba4HT1oZbiMYWc" +
    "5qzsoW2kLYcBcF4HM5vCpJyTkceULKrVXuJQkXeN5seL" +
    "4uXrFNFRMm53GWy1Yrto8rTWxZi9DkNeWP7yUPs7ELAm"

  const bytes = hexToBytes(source)
  const encoded = base58btc.encode(bytes)
  const decoded = base58btc.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-64-url-no-pad encoding and decoding", () => {
  const source = "fd91ec48b3524965f7a1453e9ffa067054eca6f7d6338a84525eb3288bb0caf7" +
    "a9651f02fee14d6d33ee1679aa8828348ccc574e194d7f57fca8be354c1b30f7"
  const expectedEncoded = "_ZHsSLNSSWX3oUU-n_oGcFTspvfWM4qEUl6zKIuwyvep" +
    "ZR8C_uFNbTPuFnmqiCg0jMxXThlNf1f8qL41TBsw9w=="

  const bytes = hexToBytes(source)
  const encoded = base64url.encode(bytes)
  const decoded = base64url.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})

Deno.test("base-64-url-no-pad encoding and decoding", () => {
  const source = "b8dc55afeb6427a990e9d60c0d363b654306d92703e5036210ca29619d8ed204" +
    "194ba3d86e31cdbc99f4ee9d5f25f0cc1c1f44f5fa39abec9a50cdf519b457e0"
  const expectedEncoded = "uuNxVr-tkJ6mQ6dYMDTY7ZUMG2ScD5QNiEMopYZ2O0gQ" +
    "ZS6PYbjHNvJn07p1fJfDMHB9E9fo5q-yaUM31GbRX4A"

  const bytes = hexToBytes(source)
  const encoded = base64urlnopad.encode(bytes)
  const decoded = base64urlnopad.decode(encoded)
  const recovered = bytesToHex(decoded)

  assertEquals(encoded, expectedEncoded)
  assertEquals(recovered, source)
})
