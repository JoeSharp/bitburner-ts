import { NS } from "@ns";
import ContractRecord from "./ContractRecord";
import solvers from "/contracts/solvers/index";

const solveContract = (ns: NS, { type, host, contract }: ContractRecord) => {
  ns.print(`Found ${type} in ${contract} on ${host}`);

  const solver = solvers[type];
  if (!!solver) {
    ns.print("Solver Found");
    const data = ns.codingcontract.getData(contract, host);
    const answer = solver(ns, data);
    const result = ns.codingcontract.attempt(answer, contract, host);
    ns.print(`Contract Attempted with Result ${result}`);
  } else {
    ns.print("No solution for contract type");
  }
};

export default solveContract;
