import { pem2jwk } from "pem-jwk";
import { exec } from "child_process";
import { unlink, writeFileSync } from "fs";

interface JWK {
  kty: string;
  n: string;
  e: string;
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
}

type PEM = string | Buffer;
export type PEMType = "public" | "private";
type ExtraKeys = Record<string, string>;

type IsRequired<T, K> = undefined extends T ? never : K;
type RequiredKeys<T> = { [K in keyof T]-?: IsRequired<T[K], K> }[keyof T];
type OnlyRequired<T> = Record<RequiredKeys<T>, T[RequiredKeys<T>]>;

export type PublicJWK<T extends ExtraKeys> = OnlyRequired<JWK> &
  Record<keyof T, T[keyof T]>;
export type PrivateJWK<T extends ExtraKeys> = Required<JWK> &
  Record<keyof T, T[keyof T]>;

export class Pem2Jwk {
  protected static TEMP_PEM_FILE_NAME = "temp.pem";

  protected static checkISValidPemType(pem: string, type: PEMType) {
    const isInvalidPemType = !pem.includes(type);

    if (isInvalidPemType)
      throw new Error('.PEM file must be "public" or "private".');
  }

  protected static convertBufferToString(pem: PEM): string {
    const isPemBuffer = Buffer.isBuffer(pem);

    return isPemBuffer ? pem.toString() : pem;
  }

  protected static createFile(name: string, content: string) {
    writeFileSync(name, content);
  }

  protected static removeFile(path: string) {
    unlink(path, () => {});
  }

  static fromPublic<T extends ExtraKeys>(
    publicPem: PEM,
    extraKeys?: T,
  ): PublicJWK<T> {
    const pem = this.convertBufferToString(publicPem);

    this.checkISValidPemType(pem, "public");

    return pem2jwk(pem, extraKeys);
  }

  static fromPrivate<T extends ExtraKeys>(
    privatePem: PEM,
    extraKeys?: T,
  ): PrivateJWK<T> {
    const pem = this.convertBufferToString(privatePem);

    this.checkISValidPemType(pem, "private");

    return pem2jwk(pem, extraKeys) as any;
  }

  static async fromPrivateToPublic<T extends ExtraKeys>(
    privatePem: PEM,
    extraKeys?: T,
  ): Promise<PublicJWK<T>> {
    const pem = this.convertBufferToString(privatePem);
    this.checkISValidPemType(pem, "private");

    const JWK = await new Promise<PublicJWK<T>>((resolve, reject) => {
      this.createFile(this.TEMP_PEM_FILE_NAME, pem);

      exec(
        `openssl rsa -in ${this.TEMP_PEM_FILE_NAME} -pubout`,
        (error, stdout) => {
          if (error != null) {
            reject(error);
            return;
          }

          resolve(Pem2Jwk.fromPublic(stdout, extraKeys));
        },
      );
    });

    this.removeFile(this.TEMP_PEM_FILE_NAME);

    return JWK;
  }
}
