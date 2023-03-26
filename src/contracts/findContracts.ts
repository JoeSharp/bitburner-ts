import { NS } from "@ns";
import { findHosts } from "utils";
import ContractRecord from "./ContractRecord";

const findContracts = (ns: NS): ContractRecord[] => {
  const contracts: ContractRecord[] = [];

  const { allHosts } = findHosts(ns);
  for (const host of allHosts) {
    const hostContracts = ns.ls(host, ".cct");
    for (const contract of hostContracts) {
      const type = ns.codingcontract.getContractType(contract, host);
      contracts.push({ type, host, contract });
    }
  }

  return contracts;
};

export default findContracts;
