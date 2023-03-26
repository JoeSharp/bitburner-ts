import { ContractSolver } from "./types";

const ORD_A = "A".charCodeAt(0);
const ORD_Z = "Z".charCodeAt(0);

export const caesarOne: ContractSolver = (
  ns,
  [plainText, key]: [string, number]
) => {
  ns.tprint(`Caesar Cipher on ${plainText} with key ${key}`);

  const cipherText = [...plainText]
    .map((p) => {
      if (p === " ") {
        return p;
      } else {
        let c = p.charCodeAt(0) - key;
        if (c < ORD_A) {
          c += ORD_Z - ORD_A + 1;
        }
        return String.fromCharCode(c);
      }
    })
    .reduce((acc, curr) => acc + curr, "");

  return cipherText;
};
