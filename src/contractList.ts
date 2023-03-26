import { NS } from "@ns";
import { findContracts } from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const contracts = findContracts(ns);

  contracts.forEach(({ host, contract, type }) =>
    ns.tprint(`Found contract ${contract} on ${host}, Type: ${type}`)
  );
}
