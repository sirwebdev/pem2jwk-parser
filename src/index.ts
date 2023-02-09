import { readFileSync } from "fs";
import { Pem2Jwk } from "./pem2jwk-parser";

export * from "./pem2jwk-parser";

const pemFile = readFileSync("private-key.pem");

Pem2Jwk.fromPrivateToPublic(pemFile).then(console.log).catch(console.error);
