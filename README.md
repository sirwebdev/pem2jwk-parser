# Pem2Jwk

A tool to convert a PEM file to a JSON Web Key (JWK). AThe package provides methods to convert both public and private PEM files, as well as a method to convert a private PEM to a public JWK.

## Requirements

- [OpenSSL](https://www.openssl.org/docs/man1.1.0/man3/RSA_generate_key.html) 1.1.0 or later

## Table of Contents

- [fromPublic](#frompublic)
- [fromPrivate](#fromprivate)
- [fromPrivateToPublic](#fromprivatetopublic)

---

## fromPublic

This method takes a public PEM file and converts it to a JSON Web Key (JWK).

#### Syntax

```typescript
Pem2Jwk.fromPublic<T>(publicPem: PEM, extraKeys?: T): PublicJWK<T>
```

#### Parameters

- `publicPem`: The public PEM file. Can be a string or a Buffer.
- `extraKeys` (optional): An object that provides additional information to be included in the JWK.

#### Return Value

The public JWK.

#### Example

```typescript
const publicPem = `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`;
const publicJwk = Pem2Jwk.fromPublic(publicPem);
console.log(publicJwk);
```

---

## fromPrivate

This method takes a private PEM file and converts it to a JSON Web Key (JWK).

#### Syntax

```typescript
Pem2Jwk.fromPrivate<T>(privatePem: PEM, extraKeys?: T): PrivateJWK<T>
```

#### Parameters

- `privatePem`: The private PEM file. Can be a string or a Buffer.
- `extraKeys` (optional): An object that provides additional information to be included in the JWK.

#### Return Value

The private JWK.

#### Example

```typescript
const privatePem = `-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----`;

const privateJwk = Pem2Jwk.fromPrivate(privatePem);
console.log(privateJwk);
```

---

## fromPrivateToPublic

This method converts a private PEM key to a public JWK. The private PEM key is passed as a parameter to the method, and the public JWK is returned.

The method works by first creating a temporary PEM file from the private PEM key and then using `openssl` to generate a public key from that file. The public key is then converted to a JWK using the `fromPublic` method.

#### Syntax

```typescript
Pem2Jwk.fromPrivateToPublic<T>(privatePem: PEM, extraKeys?: T): Promise<PublicJWK<T>>
```

#### Parameters

- `privatePem`: The private PEM file. Can be a string or a Buffer.
- `extraKeys` (optional): An object that provides additional information to be included in the JWK.

#### Return Value

A Promise that resolves to the public JWK.

#### Example

```typescript
const privatePem = `-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----`;

Pem2Jwk.fromPrivateToPublic(privatePem).then(publicJwk => {
  console.log(publicJwk);
});
```
