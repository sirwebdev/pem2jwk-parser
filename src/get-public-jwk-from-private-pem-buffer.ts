import { pem2jwk } from "pem-jwk";
import { exec } from "child_process";
import { unlink, writeFileSync } from "fs";

export interface GetPublicJWKFromPrivatePEMBufferResponse {
  kty: string;
  n: string;
  e: string;
}

function createFile(name: string, content: string) {
  writeFileSync(name, content);
}

function removeFile(path: string) {
  unlink(path, () => { });
}

export async function getPublicJWKFromPrivatePEMBuffer(
  pem: Buffer,
): Promise<GetPublicJWKFromPrivatePEMBufferResponse> {
  const tempPemFile = "temp.pem";

  const JWK = await new Promise((resolve, reject) => {
    createFile(tempPemFile, pem.toString());

    exec(`openssl rsa -in ${tempPemFile} -pubout`, (error, stdout) => {
      if (error != null) {
        reject(error);
        return;
      }

      resolve(pem2jwk(stdout));
    });
  });

  removeFile(tempPemFile);

  return JWK as GetPublicJWKFromPrivatePEMBufferResponse;
}
