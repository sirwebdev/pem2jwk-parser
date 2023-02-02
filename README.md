# Easy way to create a JWK from a .PEM file
A PEM to JWK tool converts a Privacy Enhanced Mail (PEM) encoded certificate to a JSON Web Key (JWK) format, containing information such as the public key and its algorithms. Useful for using PEM certificates in applications that expect JWK input.

# requirements

- [OpenSSL](https://www.openssl.org/)

# Usage

```typescript
import * as fs from "fs";
import { getPublicJWKFromPrivatePEMBuffer } from "jwk2pem-parser";

const pemBuffer = fs.readFileSync("key.pem");

getPublicJWKFromPrivatePEMBuffer(pemBuffer).then(console.log);

// {
//   kty: string,
//   n: string,
//   e: string
// }
```
