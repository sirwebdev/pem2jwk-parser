# Easy way to create a JWK from a .PEM file

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
