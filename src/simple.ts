import { NS } from "@ns";
import { findTargets } from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const targets = findTargets(ns);

  ns.tprint(`Potential Targets: ${targets.length}`);
  targets.forEach(ns.tprint);
}
