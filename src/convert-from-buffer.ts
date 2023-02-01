interface JWK {
  kty: string;
  n: string;
  e: string;
}

const RSA_PUBLIC_KEY_HEADER = "-----BEGIN RSA PUBLIC KEY-----";
const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
const RSA_ALGORITHM_OID = "300d06092a864886f70d0101010500";

export function convertPEMtoJWKFromBuffer(pem: Buffer): JWK {
  const pemString = pem.toString();
  const lines = pemString.split("\n");
  const base64Cert = lines.slice(1, -1).join("");
  const binaryDataEncodedWithBase64 = Buffer.from(base64Cert, "base64");

  if (isRsaPublicKey(pemString)) {
    return extractRsaPublicKey(binaryDataEncodedWithBase64);
  } else if (isPublicKey(pemString)) {
    return extractPublicKey(binaryDataEncodedWithBase64);
  } else {
    throw new Error("Unsupported PEM certificate format");
  }
}

function isRsaPublicKey(pemString: string): boolean {
  return pemString.startsWith(RSA_PUBLIC_KEY_HEADER);
}

function isPublicKey(pemString: string): boolean {
  return pemString.startsWith(PUBLIC_KEY_HEADER);
}

function extractRsaPublicKey(binaryDataEncodedWithBase64: Buffer): JWK {
  const RSA_PUBLIC_KEY_MODULUS_OFFSET = 22;
  const RSA_PUBLIC_KEY_EXPONENT_OFFSET = 18;
  const RSA_PUBLIC_KEY_EXPONENT_SIZE = 4;

  return {
    kty: "RSA",
    n: base64UrlEncode(
      binaryDataEncodedWithBase64.slice(RSA_PUBLIC_KEY_MODULUS_OFFSET),
    ),
    e: base64UrlEncode(
      binaryDataEncodedWithBase64.slice(
        RSA_PUBLIC_KEY_EXPONENT_OFFSET,
        RSA_PUBLIC_KEY_EXPONENT_OFFSET + RSA_PUBLIC_KEY_EXPONENT_SIZE,
      ),
    ),
  };
}

function extractPublicKey(binaryDataEncodedWithBase64: Buffer): JWK {
  const ALGORITHM_OID_OFFSET = 8;
  const ALGORITHM_OID_SIZE = 3;
  const RSA_PUBLIC_KEY_MODULUS_OFFSET = 29;
  const RSA_PUBLIC_KEY_EXPONENT_OFFSET = 25;
  const RSA_PUBLIC_KEY_EXPONENT_SIZE = 4;

  const algorithmOid = binaryDataEncodedWithBase64
    .slice(ALGORITHM_OID_OFFSET, ALGORITHM_OID_OFFSET + ALGORITHM_OID_SIZE)
    .toString("hex");
  if (algorithmOid === RSA_ALGORITHM_OID) {
    return {
      kty: "RSA",
      n: base64UrlEncode(
        binaryDataEncodedWithBase64.slice(RSA_PUBLIC_KEY_MODULUS_OFFSET),
      ),
      e: base64UrlEncode(
        binaryDataEncodedWithBase64.slice(
          RSA_PUBLIC_KEY_EXPONENT_OFFSET,
          RSA_PUBLIC_KEY_EXPONENT_OFFSET + RSA_PUBLIC_KEY_EXPONENT_SIZE,
        ),
      ),
    };
  } else {
    throw new Error("Unsupported PEM certificate format");
  }
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/+/g, "-")
    .replace(/\//g, "~")
    .replace(/=+$/, "");
}
