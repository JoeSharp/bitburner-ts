import { NS } from "@ns";

export type ContractSolver = (ns: NS, data: any) => any;

export interface NamedContractSolvers {
  [name: string]: ContractSolver;
}
