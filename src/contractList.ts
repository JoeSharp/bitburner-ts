import { NS } from "@ns";
import { findContracts, solveContract } from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [attempt = false] = ns.args as [boolean];

  const contracts = findContracts(ns);

  ns.tprint(`Looking for contracts, attempt? ${attempt}`);
  contracts.forEach(({ host, contract, type }) => {
    ns.tprint(`Found contract ${contract} on ${host}, Type: ${type}`);
    solveContract(ns, { contract, host, type }, attempt);
  });
}
